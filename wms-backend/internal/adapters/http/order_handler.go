package http

import (
	"net/http"
	"strconv"
	"warehouse-wms-backend/internal/models"
	"warehouse-wms-backend/internal/repository"
	"warehouse-wms-backend/pkg/logger"
	"warehouse-wms-backend/pkg/report"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"go.uber.org/zap"
)

type OrderHandler struct {
	db       *gorm.DB
	repo     repository.OrderRepository
	prodRepo repository.ProductRepository
	logRepo  repository.StockLogRepository
}

func NewOrderHandler(db *gorm.DB, repo repository.OrderRepository, prodRepo repository.ProductRepository, logRepo repository.StockLogRepository) *OrderHandler {
	return &OrderHandler{db, repo, prodRepo, logRepo}
}

func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload format"})
		return
	}

	// Transaction started to ensure Atomicity (Google Standard)
	err := h.db.Transaction(func(tx *gorm.DB) error {
		// 1. Create Order
		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		// 2. Update Stock
		var product models.Product
		if err := tx.Set("gorm:query_option", "FOR UPDATE").First(&product, order.ProductID).Error; err != nil {
			return err
		}

		if product.Stock < order.Quantity {
			return gorm.ErrInvalidData // Not enough stock
		}

		product.Stock -= order.Quantity
		if err := tx.Save(&product).Error; err != nil {
			return err
		}

		// 3. Log Stock Movement
		userID, _ := c.Get("userID")
		stockLog := &models.StockLog{
			ProductID: order.ProductID,
			Type:      "OUT",
			Quantity:  order.Quantity,
			Reference: order.OrderNumber,
			Reason:    "Customer Order",
			CreatedBy: userID.(uint),
		}
		if err := tx.Create(stockLog).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		logger.Log.Error("Failed to create order transaction", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process order. Transaction rolled back."})
		return
	}

	logger.Log.Info("Order created successfully", zap.String("order_number", order.OrderNumber))
	c.JSON(http.StatusCreated, order)
}

func (h *OrderHandler) GetAllOrders(c *gin.Context) {
	orders, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}
	c.JSON(http.StatusOK, orders)
}

func (h *OrderHandler) DeleteOrder(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.repo.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete order"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Order deleted"})
}

func (h *OrderHandler) PrintInvoice(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	order, err := h.repo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	pdf, err := report.GenerateOrderInvoice(order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate PDF"})
		return
	}

	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", fmt.Sprintf("inline; filename=invoice-%s.pdf", order.OrderNumber))
	pdf.Output(c.Writer)
}
