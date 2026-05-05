package http

import (
	"net/http"
	"strconv"
	"warehouse-wms-backend/internal/models"
	"warehouse-wms-backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type MasterDataHandler struct {
	suppRepo  repository.SupplierRepository
	custRepo  repository.CustomerRepository
	whRepo    repository.WarehouseRepository
}

func NewMasterDataHandler(suppRepo repository.SupplierRepository, custRepo repository.CustomerRepository, whRepo repository.WarehouseRepository) *MasterDataHandler {
	return &MasterDataHandler{suppRepo, custRepo, whRepo}
}

// Suppliers
func (h *MasterDataHandler) GetAllSuppliers(c *gin.Context) {
	data, err := h.suppRepo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (h *MasterDataHandler) CreateSupplier(c *gin.Context) {
	var supp models.Supplier
	if err := c.ShouldBindJSON(&supp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	h.suppRepo.Create(&supp)
	c.JSON(http.StatusCreated, supp)
}

// Customers
func (h *MasterDataHandler) GetAllCustomers(c *gin.Context) {
	data, err := h.custRepo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (h *MasterDataHandler) CreateCustomer(c *gin.Context) {
	var cust models.Customer
	if err := c.ShouldBindJSON(&cust); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	h.custRepo.Create(&cust)
	c.JSON(http.StatusCreated, cust)
}

// Warehouses
func (h *MasterDataHandler) GetAllWarehouses(c *gin.Context) {
	data, err := h.whRepo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

func (h *MasterDataHandler) CreateWarehouse(c *gin.Context) {
	var wh models.Warehouse
	if err := c.ShouldBindJSON(&wh); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	h.whRepo.Create(&wh)
	c.JSON(http.StatusCreated, wh)
}

func (h *MasterDataHandler) DeleteWarehouse(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	h.whRepo.Delete(uint(id))
	c.JSON(http.StatusOK, gin.H{"message": "Warehouse deleted"})
}
