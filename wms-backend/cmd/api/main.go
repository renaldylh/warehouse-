package main

import (
	"fmt"
	"log"
	"os"
	"warehouse-wms-backend/pkg/database"
	"warehouse-wms-backend/internal/repository"
	http_handler "warehouse-wms-backend/internal/adapters/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	// Connect to Database
	database.ConnectDB()

	// Initialize Repositories
	productRepo := repository.NewProductRepository(database.DB)
	orderRepo := repository.NewOrderRepository(database.DB)

	// Initialize Handlers
	productHandler := http_handler.NewProductHandler(productRepo)
	dashboardHandler := http_handler.NewDashboardHandler(productRepo, orderRepo)

	// Initialize Gin
	r := gin.Default()

	// Setup CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// API Routes
	api := r.Group("/api")
	{
		// Health Check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status": "up",
				"message": "WMS Backend is running smoothly",
			})
		})

		// Dashboard
		api.GET("/dashboard/stats", dashboardHandler.GetStats)

		// Products
		api.GET("/products", productHandler.GetAllProducts)
		api.GET("/products/:id", productHandler.GetProductByID)
		api.POST("/products", productHandler.CreateProduct)
	}

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	fmt.Printf("Server starting at :%s\n", port)
	r.Run(":" + port)
}
