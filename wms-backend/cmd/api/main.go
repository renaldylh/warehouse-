package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"warehouse-wms-backend/pkg/database"
	"warehouse-wms-backend/pkg/logger"
	"warehouse-wms-backend/pkg/config"
	"warehouse-wms-backend/internal/repository"
	http_handler "warehouse-wms-backend/internal/adapters/http"
	"warehouse-wms-backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	// 1. Initialize Logger (Google Standard)
	logger.InitLogger()
	defer logger.Log.Sync()

	// 2. Load Configuration
	cfg := config.LoadConfig()

	// 3. Connect to Database
	database.ConnectDB()

	// 4. Initialize Repositories
	userRepo := repository.NewUserRepository(database.DB)
	productRepo := repository.NewProductRepository(database.DB)
	orderRepo := repository.NewOrderRepository(database.DB)
	receivingRepo := repository.NewReceivingRepository(database.DB)
	shippingRepo := repository.NewShippingRepository(database.DB)
	stockLogRepo := repository.NewStockLogRepository(database.DB)
	suppRepo := repository.NewSupplierRepository(database.DB)
	custRepo := repository.NewCustomerRepository(database.DB)
	whRepo := repository.NewWarehouseRepository(database.DB)

	// 5. Initialize Handlers
	authHandler := http_handler.NewAuthHandler(userRepo)
	productHandler := http_handler.NewProductHandler(productRepo)
	dashboardHandler := http_handler.NewDashboardHandler(productRepo, orderRepo)
	// Pass DB to handlers that need transactions
	orderHandler := http_handler.NewOrderHandler(database.DB, orderRepo, productRepo, stockLogRepo)
	receivingHandler := http_handler.NewReceivingHandler(database.DB, receivingRepo, productRepo, stockLogRepo)
	shippingHandler := http_handler.NewShippingHandler(database.DB, shippingRepo, productRepo, stockLogRepo)
	marketplaceHandler := http_handler.NewMarketplaceHandler(productRepo)
	masterDataHandler := http_handler.NewMasterDataHandler(suppRepo, custRepo, whRepo)

	// 6. Initialize Gin
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// 7. Middlewares
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Rate Limiting (Google Standard: 10 req/sec)
	limiter := middleware.NewIPRateLimiter(10, 20)
	r.Use(middleware.RateLimitMiddleware(limiter))

	// 8. API Routes (Versioning: V1)
	v1 := r.Group("/api/v1")
	{
		v1.POST("/auth/register", authHandler.Register)
		v1.POST("/auth/login", authHandler.Login)

		protected := v1.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/dashboard/stats", dashboardHandler.GetStats)
			protected.GET("/products", productHandler.GetAllProducts)
			protected.POST("/products", productHandler.CreateProduct)
			protected.GET("/products/export/csv", productHandler.ExportCSV)

			protected.GET("/orders", orderHandler.GetAllOrders)
			protected.POST("/orders", orderHandler.CreateOrder)
			protected.DELETE("/orders/:id", orderHandler.DeleteOrder)

			protected.GET("/receiving", receivingHandler.GetAllReceivings)
			protected.POST("/receiving", receivingHandler.CreateReceiving)

			protected.GET("/shipping", shippingHandler.GetAllShippings)
			protected.POST("/shipping", shippingHandler.CreateShipping)

			protected.POST("/marketplace/sync/:marketplace", marketplaceHandler.SyncMarketplace)

			protected.GET("/suppliers", masterDataHandler.GetAllSuppliers)
			protected.POST("/suppliers", masterDataHandler.CreateSupplier)
			protected.GET("/customers", masterDataHandler.GetAllCustomers)
			protected.POST("/customers", masterDataHandler.CreateCustomer)
			protected.GET("/warehouses", masterDataHandler.GetAllWarehouses)
			protected.POST("/warehouses", masterDataHandler.CreateWarehouse)
		}
	}

	// 9. Graceful Shutdown (Google Standard)
	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: r,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Log.Fatal("Listen error", zap.Error(err))
		}
	}()

	logger.Log.Info("Server started successfully", zap.String("port", cfg.Port))

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Log.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Log.Fatal("Server forced to shutdown", zap.Error(err))
	}

	logger.Log.Info("Server exited gracefully")
}
