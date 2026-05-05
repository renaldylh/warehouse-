package repository

import (
	"warehouse-wms-backend/internal/models"
	"gorm.io/gorm"
)

type ProductRepository interface {
	GetAll(search string, category string) ([]models.Product, error)
	GetByID(id uint) (*models.Product, error)
	GetBySKU(sku string) (*models.Product, error)
	Create(product *models.Product) error
	Update(product *models.Product) error
	Delete(id uint) error
	Count() (int64, error)
	CountLowStock(threshold int) (int64, error)
	TotalValue() (float64, error)
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db}
}

func (r *productRepository) GetAll(search string, category string) ([]models.Product, error) {
	var products []models.Product
	query := r.db.Model(&models.Product{})

	if search != "" {
		query = query.Where("sku ILIKE ? OR name ILIKE ?", "%"+search+"%", "%"+search+"%")
	}
	if category != "" {
		query = query.Where("category = ?", category)
	}

	err := query.Find(&products).Error
	return products, err
}

func (r *productRepository) GetByID(id uint) (*models.Product, error) {
	var product models.Product
	err := r.db.First(&product, id).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) GetBySKU(sku string) (*models.Product, error) {
	var product models.Product
	err := r.db.Where("sku = ?", sku).First(&product).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
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

func (r *productRepository) CountLowStock(threshold int) (int64, error) {
	var count int64
	err := r.db.Model(&models.Product{}).Where("stock <= ?", threshold).Count(&count).Error
	return count, err
}

func (r *productRepository) TotalValue() (float64, error) {
	var total float64
	err := r.db.Model(&models.Product{}).Select("SUM(stock * base_price)").Scan(&total).Error
	return total, err
}
