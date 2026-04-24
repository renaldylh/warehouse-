package http

import (
	"net/http"
	"warehouse-wms-backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type ReceivingHandler struct {
	repo repository.ReceivingRepository
}

func NewReceivingHandler(repo repository.ReceivingRepository) *ReceivingHandler {
	return &ReceivingHandler{repo}
}

func (h *ReceivingHandler) GetAllReceivings(c *gin.Context) {
	results, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, results)
}
