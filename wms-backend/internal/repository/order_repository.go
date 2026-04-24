package repository

import (
	"warehouse-wms-backend/internal/models"
	"gorm.io/gorm"
)

type OrderRepository interface {
	GetAll() ([]models.Order, error)
	GetByID(id uint) (*models.Order, error)
	Create(order *models.Order) error
	Update(order *models.Order) error
	Delete(id uint) error
	Count() (int64, error)
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db}
}

func (r *orderRepository) GetAll() ([]models.Order, error) {
	var orders []models.Order
	err := r.db.Find(&orders).Error
	return orders, err
}

func (r *orderRepository) GetByID(id uint) (*models.Order, error) {
	var order models.Order
	err := r.db.First(&order, id).Error
	return &order, err
}

func (r *orderRepository) Create(order *models.Order) error {
	return r.db.Create(order).Error
}

func (r *orderRepository) Update(order *models.Order) error {
	return r.db.Save(order).Error
}

func (r *orderRepository) Delete(id uint) error {
	return r.db.Delete(&models.Order{}, id).Error
}

func (r *orderRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&models.Order{}).Count(&count).Error
	return count, err
}
