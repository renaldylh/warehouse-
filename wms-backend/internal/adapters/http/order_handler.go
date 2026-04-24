package http

import (
	"net/http"
	"warehouse-wms-backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type OrderHandler struct {
	repo repository.OrderRepository
}

func NewOrderHandler(repo repository.OrderRepository) *OrderHandler {
	return &OrderHandler{repo}
}

func (h *OrderHandler) GetAllOrders(c *gin.Context) {
	orders, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, orders)
}
