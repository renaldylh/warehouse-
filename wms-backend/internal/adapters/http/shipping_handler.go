package http

import (
	"net/http"
	"strconv"
	"warehouse-wms-backend/internal/models"
	"warehouse-wms-backend/internal/repository"
	"warehouse-wms-backend/pkg/logger"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"go.uber.org/zap"
)

type ShippingHandler struct {
	db       *gorm.DB
	repo     repository.ShippingRepository
	prodRepo repository.ProductRepository
	logRepo  repository.StockLogRepository
}

func NewShippingHandler(db *gorm.DB, repo repository.ShippingRepository, prodRepo repository.ProductRepository, logRepo repository.StockLogRepository) *ShippingHandler {
	return &ShippingHandler{db, repo, prodRepo, logRepo}
}

func (h *ShippingHandler) CreateShipping(c *gin.Context) {
	var ship models.Shipping
	if err := c.ShouldBindJSON(&ship); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	err := h.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&ship).Error; err != nil {
			return err
		}

		var product models.Product
		if err := tx.Set("gorm:query_option", "FOR UPDATE").First(&product, ship.ProductID).Error; err != nil {
			return err
		}

		if product.Stock < ship.Quantity {
			return gorm.ErrInvalidData
		}

		product.Stock -= ship.Quantity
		if err := tx.Save(&product).Error; err != nil {
			return err
		}

		userID, _ := c.Get("userID")
		stockLog := &models.StockLog{
			ProductID: ship.ProductID,
			Type:      "OUT",
			Quantity:  ship.Quantity,
			Reference: ship.ShipmentID,
			Reason:    "Outbound Shipment",
			CreatedBy: userID.(uint),
		}
		return tx.Create(stockLog).Error
	})

	if err != nil {
		logger.Log.Error("Shipping transaction failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process shipping"})
		return
	}

	c.JSON(http.StatusCreated, ship)
}

func (h *ShippingHandler) GetAllShippings(c *gin.Context) {
	data, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (h *ShippingHandler) DeleteShipping(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.repo.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete record"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Record deleted"})
}
