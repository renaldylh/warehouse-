package main

import (
	"fmt"
	"log"
	"time"
	"warehouse-wms-backend/internal/models"
	"warehouse-wms-backend/pkg/database"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found")
	}

	database.ConnectDB()

	// Seed Products
	products := []models.Product{
		{SKU: "PROD-001", Name: "Kaos Polos Putih M", Category: "Baju", Stock: 150, BasePrice: 50000},
		{SKU: "PROD-002", Name: "Kaos Polos Putih L", Category: "Baju", Stock: 85, BasePrice: 55000},
		{SKU: "PROD-003", Name: "Sweater Navy XL", Category: "Jaket", Stock: 24, BasePrice: 150000},
		{SKU: "PROD-004", Name: "Celana Cargo Army", Category: "Celana", Stock: 60, BasePrice: 120000},
	}

	for _, p := range products {
		database.DB.Create(&p)
	}

	// Seed Orders
	orders := []models.Order{
		{OrderNumber: "ORD-20260424-001", Marketplace: "Shopee", CustomerName: "Budi", TotalPrice: 150000, Status: "completed"},
		{OrderNumber: "ORD-20260424-002", Marketplace: "Tokopedia", CustomerName: "Ani", TotalPrice: 240000, Status: "processing"},
	}

	for _, o := range orders {
		database.DB.Create(&o)
	}

	// Seed Receiving
	receivings := []models.Receiving{
		{ReceptionID: "REC-101", Supplier: "Cotton Direct", ItemsReceived: "500 Rolls Fabric", Condition: "Good", Date: time.Now()},
		{ReceptionID: "REC-102", Supplier: "Indigo Dye Co.", ItemsReceived: "20 Barrels", Condition: "Good", Date: time.Now()},
	}

	for _, r := range receivings {
		database.DB.Create(&r)
	}

	// Seed Shipping
	shippings := []models.Shipping{
		{ShipmentID: "SHP-501", Destination: "Jakarta Hub", Courier: "JNE Express", Weight: "12.5 KG", Status: "In Transit", Date: time.Now()},
		{ShipmentID: "SHP-502", Destination: "Bandung Store", Courier: "SiCepat", Weight: "5.2 KG", Status: "Delivered", Date: time.Now()},
	}

	for _, s := range shippings {
		database.DB.Create(&s)
	}

	fmt.Println("Database seeded successfully!")
}
