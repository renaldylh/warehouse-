package models

import (
	"time"
	"gorm.io/gorm"
)

type Product struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	SKU         string         `gorm:"uniqueIndex;not null" json:"sku"`
	Name        string         `gorm:"not null" json:"name"`
	Category    string         `json:"category"`
	Stock       int            `gorm:"default:0" json:"stock"`
	BasePrice   float64        `json:"base_price"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type MarketplaceMapping struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	ProductID     uint      `json:"product_id"`
	Marketplace   string    `json:"marketplace"` // shopee, tokopedia, tiktok
	MarketplaceID string    `json:"marketplace_id"` // external product id
	MarketplaceSKU string   `json:"marketplace_sku"`
	SyncStatus    string    `json:"sync_status"` // synced, error
	LastSync      time.Time `json:"last_sync"`
}

type Order struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	OrderNumber     string    `gorm:"uniqueIndex;not null" json:"order_number"`
	Marketplace     string    `json:"marketplace"`
	ExternalOrderID string    `json:"external_order_id"`
	CustomerName    string    `json:"customer_name"`
	TotalPrice      float64   `json:"total_price"`
	Status          string    `json:"status"` // pending, processing, shipped, completed, cancelled
	OrderDate       time.Time `json:"order_date"`
	CreatedAt       time.Time `json:"created_at"`
}
