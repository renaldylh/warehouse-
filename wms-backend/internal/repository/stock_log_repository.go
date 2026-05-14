package repository

import (
	"warehouse-wms-backend/internal/models"
	"gorm.io/gorm"
)

type StockLogRepository interface {
	Create(log *models.StockLog) error
	GetByProductID(productID uint) ([]models.StockLog, error)
	GetAll() ([]models.StockLog, error)
	GetDailyMovement() ([]map[string]interface{}, error)
	GetRecentLogs(limit int) ([]models.StockLog, error)
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
func (r *stockLogRepository) GetDailyMovement() ([]map[string]interface{}, error) {
	var results []map[string]interface{}
	// Get last 7 days of movement
	query := `
		SELECT 
			TO_CHAR(created_at, 'Dy') as name,
			SUM(CASE WHEN type = 'OUT' THEN quantity ELSE 0 END) as sales,
			SUM(CASE WHEN type = 'IN' THEN quantity ELSE 0 END) as inventory
		FROM stock_logs 
		WHERE created_at > NOW() - INTERVAL '7 days'
		GROUP BY TO_CHAR(created_at, 'Dy'), DATE_TRUNC('day', created_at)
		ORDER BY DATE_TRUNC('day', created_at) ASC
	`
	err := r.db.Raw(query).Scan(&results).Error
	return results, err
}

func (r *stockLogRepository) GetRecentLogs(limit int) ([]models.StockLog, error) {
	var logs []models.StockLog
	err := r.db.Preload("Product").Order("created_at desc").Limit(limit).Find(&logs).Error
	return logs, err
}
