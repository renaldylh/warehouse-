package repository

import (
	"warehouse-wms-backend/internal/models"
	"gorm.io/gorm"
)

type WarehouseRepository interface {
	GetAll() ([]models.Warehouse, error)
	GetByID(id uint) (*models.Warehouse, error)
	Create(warehouse *models.Warehouse) error
	Update(warehouse *models.Warehouse) error
	Delete(id uint) error
}

type warehouseRepository struct {
	db *gorm.DB
}

func NewWarehouseRepository(db *gorm.DB) WarehouseRepository {
	return &warehouseRepository{db}
}

func (r *warehouseRepository) GetAll() ([]models.Warehouse, error) {
	var warehouses []models.Warehouse
	err := r.db.Find(&warehouses).Error
	return warehouses, err
}

func (r *warehouseRepository) GetByID(id uint) (*models.Warehouse, error) {
	var warehouse models.Warehouse
	err := r.db.First(&warehouse, id).Error
	return &warehouse, err
}

func (r *warehouseRepository) Create(warehouse *models.Warehouse) error {
	return r.db.Create(warehouse).Error
}

func (r *warehouseRepository) Update(warehouse *models.Warehouse) error {
	return r.db.Save(warehouse).Error
}

func (r *warehouseRepository) Delete(id uint) error {
	return r.db.Delete(&models.Warehouse{}, id).Error
}
