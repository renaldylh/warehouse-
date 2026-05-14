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
	ImageURL    string         `json:"image_url"`
	WarehouseID uint           `json:"warehouse_id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type Warehouse struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Location  string    `json:"location"`
	CreatedAt time.Time `json:"created_at"`
}

type Supplier struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Contact   string    `json:"contact"`
	Address   string    `json:"address"`
	CreatedAt time.Time `json:"created_at"`
}

type Customer struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Address   string    `json:"address"`
	CreatedAt time.Time `json:"created_at"`
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
	CustomerID      uint      `json:"customer_id"`
	Customer        Customer  `gorm:"foreignKey:CustomerID" json:"customer"`
	ProductID       uint      `json:"product_id"`
	Quantity        int       `json:"quantity"`
	TotalPrice      float64   `json:"total_price"`
	Status          string    `json:"status"` // pending, picked, packed, shipping, completed, cancelled
	OrderDate       time.Time `json:"order_date"`
	CreatedAt       time.Time `json:"created_at"`
}

type Receiving struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	ReceptionID  string    `gorm:"uniqueIndex;not null" json:"reception_id"`
	SupplierID   uint      `json:"supplier_id"`
	Supplier     Supplier  `gorm:"foreignKey:SupplierID" json:"supplier"`
	ProductID    uint      `json:"product_id"`
	Quantity     int       `json:"quantity"`
	ItemsReceived string    `json:"items_received"` // detailed description
	Condition    string    `json:"condition"`
	Date         time.Time `json:"date"`
	CreatedAt    time.Time `json:"created_at"`
}

type Shipping struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	ShipmentID  string    `gorm:"uniqueIndex;not null" json:"shipment_id"`
	ProductID   uint      `json:"product_id"`
	Quantity    int       `json:"quantity"`
	Destination string    `json:"destination"`
	Courier     string    `json:"courier"`
	Weight      string    `json:"weight"`
	Status      string    `json:"status"`
	Date        time.Time `json:"date"`
	CreatedAt   time.Time `json:"created_at"`
}

type User struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	Username       string         `gorm:"uniqueIndex;not null" json:"username"`
	Password       string         `gorm:"not null" json:"password"`
	FullName       string         `json:"full_name"`
	Role           string         `json:"role"` // admin, staff
	LoginAttempts  int            `gorm:"default:0" json:"-"`
	LockedUntil    *time.Time     `json:"-"`
	RefreshToken   string         `json:"-"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

type StockLog struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ProductID uint      `json:"product_id"`
	Product   Product   `gorm:"foreignKey:ProductID" json:"product"`
	Type      string    `json:"type"` // IN, OUT, SYNC
	Quantity  int       `json:"quantity"`
	Reference string    `json:"reference"` // order_number, reception_id, etc
	Reason    string    `json:"reason"`
	CreatedBy uint      `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
}

type ActivityLog struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"user"`
	Action    string    `json:"action"` // CREATE, UPDATE, DELETE
	Entity    string    `json:"entity"` // PRODUCT, SUPPLIER, etc
	EntityID  uint      `json:"entity_id"`
	Details   string    `json:"details"`
	CreatedAt time.Time `json:"created_at"`
}
