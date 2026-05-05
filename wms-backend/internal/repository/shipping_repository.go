package repository

import (
	"warehouse-wms-backend/internal/models"
	"gorm.io/gorm"
)

type ShippingRepository interface {
	GetAll() ([]models.Shipping, error)
	Create(shipping *models.Shipping) error
	Delete(id uint) error
}

type shippingRepository struct {
	db *gorm.DB
}

func NewShippingRepository(db *gorm.DB) ShippingRepository {
	return &shippingRepository{db}
}

func (r *shippingRepository) GetAll() ([]models.Shipping, error) {
	var results []models.Shipping
	err := r.db.Find(&results).Error
	return results, err
}

func (r *shippingRepository) Create(shipping *models.Shipping) error {
	return r.db.Create(shipping).Error
}

func (r *shippingRepository) Delete(id uint) error {
	return r.db.Delete(&models.Shipping{}, id).Error
}
