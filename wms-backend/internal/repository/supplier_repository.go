package repository

import (
	"warehouse-wms-backend/internal/models"
	"gorm.io/gorm"
)

type SupplierRepository interface {
	GetAll() ([]models.Supplier, error)
	GetByID(id uint) (*models.Supplier, error)
	Create(supplier *models.Supplier) error
	Update(supplier *models.Supplier) error
	Delete(id uint) error
}

type supplierRepository struct {
	db *gorm.DB
}

func NewSupplierRepository(db *gorm.DB) SupplierRepository {
	return &supplierRepository{db}
}

func (r *supplierRepository) GetAll() ([]models.Supplier, error) {
	var suppliers []models.Supplier
	err := r.db.Find(&suppliers).Error
	return suppliers, err
}

func (r *supplierRepository) GetByID(id uint) (*models.Supplier, error) {
	var supplier models.Supplier
	err := r.db.First(&supplier, id).Error
	return &supplier, err
}

func (r *supplierRepository) Create(supplier *models.Supplier) error {
	return r.db.Create(supplier).Error
}

func (r *supplierRepository) Update(supplier *models.Supplier) error {
	return r.db.Save(supplier).Error
}

func (r *supplierRepository) Delete(id uint) error {
	return r.db.Delete(&models.Supplier{}, id).Error
}
