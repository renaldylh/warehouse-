package repository

import (
	"warehouse-wms-backend/internal/models"
	"gorm.io/gorm"
)

type StockLogRepository interface {
	Create(log *models.StockLog) error
	GetByProductID(productID uint) ([]models.StockLog, error)
	GetAll() ([]models.StockLog, error)
}

type stockLogRepository struct {
	db *gorm.DB
}

func NewStockLogRepository(db *gorm.DB) StockLogRepository {
	return &stockLogRepository{db}
}

func (r *stockLogRepository) Create(log *models.StockLog) error {
	return r.db.Create(log).Error
}

func (r *stockLogRepository) GetByProductID(productID uint) ([]models.StockLog, error) {
	var logs []models.StockLog
	err := r.db.Preload("Product").Where("product_id = ?", productID).Order("created_at desc").Find(&logs).Error
	return logs, err
}

func (r *stockLogRepository) GetAll() ([]models.StockLog, error) {
	var logs []models.StockLog
	err := r.db.Preload("Product").Order("created_at desc").Find(&logs).Error
	return logs, err
}
