package http

import (
	"net/http"
	"warehouse-wms-backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type ShippingHandler struct {
	repo repository.ShippingRepository
}

func NewShippingHandler(repo repository.ShippingRepository) *ShippingHandler {
	return &ShippingHandler{repo}
}

func (h *ShippingHandler) GetAllShippings(c *gin.Context) {
	results, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, results)
}
