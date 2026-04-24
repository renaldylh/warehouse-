package repository

import (
	"warehouse-wms-backend/internal/models"
	"gorm.io/gorm"
)

type ReceivingRepository interface {
	GetAll() ([]models.Receiving, error)
	Create(receiving *models.Receiving) error
}

type receivingRepository struct {
	db *gorm.DB
}

func NewReceivingRepository(db *gorm.DB) ReceivingRepository {
	return &receivingRepository{db}
}

func (r *receivingRepository) GetAll() ([]models.Receiving, error) {
	var results []models.Receiving
	err := r.db.Find(&results).Error
	return results, err
}

func (r *receivingRepository) Create(receiving *models.Receiving) error {
	return r.db.Create(receiving).Error
}
