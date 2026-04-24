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

func NewDashboardHandler(pRepo repository.ProductRepository, oRepo repository.OrderRepository) *DashboardHandler {
	return &DashboardHandler{pRepo, oRepo}
}

func (h *DashboardHandler) GetStats(c *gin.Context) {
	inventoryCount, _ := h.productRepo.Count()
	orderCount, _ := h.orderRepo.Count()
	
	// Mocking other counts for now as we don't have receiving/shipping models yet
	receivingCount := 45
	shippingCount := 8

	c.JSON(http.StatusOK, gin.H{
		"inventory_count": inventoryCount,
		"receiving_count": receivingCount,
		"order_count":     orderCount,
		"shipping_count":   shippingCount,
	})
}
