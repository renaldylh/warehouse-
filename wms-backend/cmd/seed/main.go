package main

import (
	"fmt"
	"log"
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

	fmt.Println("Database seeded successfully!")
}
