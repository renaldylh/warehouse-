package repository

import (
	"warehouse-wms-backend/internal/models"
	"gorm.io/gorm"
)

type ProductRepository interface {
	GetAll() ([]models.Product, error)
	GetByID(id uint) (*models.Product, error)
	Create(product *models.Product) error
	Update(product *models.Product) error
	Delete(id uint) error
	Count() (int64, error)
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db}
}

func (r *productRepository) GetAll() ([]models.Product, error) {
	var products []models.Product
	err := r.db.Find(&products).Error
	return products, err
}

func (r *productRepository) GetByID(id uint) (*models.Product, error) {
	var product models.Product
	err := r.db.First(&product, id).Error
	return &product, err
}

func (r *productRepository) Create(product *models.Product) error {
	return r.db.Create(product).Error
}

func (r *productRepository) Update(product *models.Product) error {
	return r.db.Save(product).Error
}

func (r *productRepository) Delete(id uint) error {
	return r.db.Delete(&models.Product{}, id).Error
}

func (r *productRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&models.Product{}).Count(&count).Error
	return count, err
}
