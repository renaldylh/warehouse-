package http

import (
	"net/http"
	"warehouse-wms-backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	productRepo repository.ProductRepository
	orderRepo   repository.OrderRepository
	logRepo     repository.StockLogRepository
	auditRepo   repository.ActivityLogRepository
}

func NewDashboardHandler(productRepo repository.ProductRepository, orderRepo repository.OrderRepository, logRepo repository.StockLogRepository, auditRepo repository.ActivityLogRepository) *DashboardHandler {
	return &DashboardHandler{productRepo, orderRepo, logRepo, auditRepo}
}

func (h *DashboardHandler) GetStats(c *gin.Context) {
	totalProducts, _ := h.productRepo.Count()
	totalOrders, _ := h.orderRepo.Count()
	lowStockCount, _ := h.productRepo.CountLowStock(10) // Threshold of 10
	totalValue, _ := h.productRepo.TotalValue()
	movementData, _ := h.logRepo.GetDailyMovement()
	recentLogs, _ := h.logRepo.GetRecentLogs(5)

	c.JSON(http.StatusOK, gin.H{
		"total_products":    totalProducts,
		"total_orders":      totalOrders,
		"low_stock_count":   lowStockCount,
		"total_value":       totalValue,
		"movement_data":     movementData,
		"recent_activities": recentLogs,
	})
}

func (h *DashboardHandler) GetAllActivities(c *gin.Context) {
	logs, err := h.auditRepo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch activities"})
		return
	}
	c.JSON(http.StatusOK, logs)
}
