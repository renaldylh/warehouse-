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

type ReceivingHandler struct {
	db       *gorm.DB
	repo     repository.ReceivingRepository
	prodRepo repository.ProductRepository
	logRepo  repository.StockLogRepository
}

func NewReceivingHandler(db *gorm.DB, repo repository.ReceivingRepository, prodRepo repository.ProductRepository, logRepo repository.StockLogRepository) *ReceivingHandler {
	return &ReceivingHandler{db, repo, prodRepo, logRepo}
}

func (h *ReceivingHandler) CreateReceiving(c *gin.Context) {
	var rec models.Receiving
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	err := h.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&rec).Error; err != nil {
			return err
		}

		var product models.Product
		if err := tx.Set("gorm:query_option", "FOR UPDATE").First(&product, rec.ProductID).Error; err != nil {
			return err
		}

		product.Stock += rec.Quantity
		if err := tx.Save(&product).Error; err != nil {
			return err
		}

		userID, _ := c.Get("userID")
		stockLog := &models.StockLog{
			ProductID: rec.ProductID,
			Type:      "IN",
			Quantity:  rec.Quantity,
			Reference: rec.ReceptionID,
			Reason:    "Supplier Delivery",
			CreatedBy: userID.(uint),
		}
		return tx.Create(stockLog).Error
	})

	if err != nil {
		logger.Log.Error("Receiving transaction failed", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process receiving"})
		return
	}

	c.JSON(http.StatusCreated, rec)
}

func (h *ReceivingHandler) GetAllReceivings(c *gin.Context) {
	data, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (h *ReceivingHandler) DeleteReceiving(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.repo.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete record"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Record deleted"})
}
