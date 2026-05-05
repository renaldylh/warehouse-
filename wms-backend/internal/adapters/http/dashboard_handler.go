package http

import (
	"net/http"
	"warehouse-wms-backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	productRepo repository.ProductRepository
	orderRepo   repository.OrderRepository
}

func NewDashboardHandler(productRepo repository.ProductRepository, orderRepo repository.OrderRepository) *DashboardHandler {
	return &DashboardHandler{productRepo, orderRepo}
}

func (h *DashboardHandler) GetStats(c *gin.Context) {
	totalProducts, _ := h.productRepo.Count()
	totalOrders, _ := h.orderRepo.Count()
	lowStockCount, _ := h.productRepo.CountLowStock(10) // Threshold of 10
	totalValue, _ := h.productRepo.TotalValue()

	c.JSON(http.StatusOK, gin.H{
		"total_products":  totalProducts,
		"total_orders":    totalOrders,
		"low_stock_count": lowStockCount,
		"total_value":     totalValue,
	})
}
