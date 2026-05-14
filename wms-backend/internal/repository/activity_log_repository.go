package repository

import (
	"warehouse-wms-backend/internal/models"
	"gorm.io/gorm"
)

type ActivityLogRepository interface {
	Create(log *models.ActivityLog) error
	GetAll() ([]models.ActivityLog, error)
}

type activityLogRepository struct {
	db *gorm.DB
}

func NewActivityLogRepository(db *gorm.DB) ActivityLogRepository {
	return &activityLogRepository{db}
}

func (r *activityLogRepository) Create(log *models.ActivityLog) error {
	return r.db.Create(log).Error
}

func (r *activityLogRepository) GetAll() ([]models.ActivityLog, error) {
	var logs []models.ActivityLog
	err := r.db.Preload("User").Order("created_at desc").Find(&logs).Error
	return logs, err
}
