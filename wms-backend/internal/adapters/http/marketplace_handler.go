package http

import (
	"math/rand"
	"net/http"
	"time"
	"warehouse-wms-backend/internal/models"
	"warehouse-wms-backend/internal/repository"

	"github.com/gin-gonic/gin"
)

type MarketplaceHandler struct {
	productRepo repository.ProductRepository
}

func NewMarketplaceHandler(productRepo repository.ProductRepository) *MarketplaceHandler {
	return &MarketplaceHandler{productRepo: productRepo}
}

func (h *MarketplaceHandler) SyncMarketplace(c *gin.Context) {
	marketplace := c.Param("marketplace") // shopee, tokopedia, tiktok

	// Mocking API call to marketplace
	time.Sleep(1 * time.Second)

	// Simulate fetching products from marketplace
	mockMarketplaceProducts := []struct {
		SKU  string
		Name string
		Price float64
	}{
		{SKU: "MKP-001", Name: "Product from " + marketplace, Price: 150000},
		{SKU: "MKP-002", Name: "Awesome Item " + marketplace, Price: 250000},
	}

	for _, mp := range mockMarketplaceProducts {
		// Check if product exists in our system
		existing, _ := h.productRepo.GetBySKU(mp.SKU)
		if existing == nil {
			// Create new product if not exists
			newProduct := &models.Product{
				SKU:       mp.SKU,
				Name:      mp.Name,
				Category:  "Marketplace",
				Stock:     rand.Intn(100),
				BasePrice: mp.Price,
			}
			h.productRepo.Create(newProduct)
		} else {
			// Update stock for existing product
			existing.Stock += rand.Intn(10)
			h.productRepo.Update(existing)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully synced with " + marketplace,
		"synced_items": len(mockMarketplaceProducts),
	})
}
