package main

import (
	"fmt"
	"log"
	"warehouse-wms-backend/internal/models"
	"warehouse-wms-backend/pkg/database"
	"golang.org/x/crypto/bcrypt"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	database.ConnectDB()

	username := "admin"
	password := "admin123"
	fullName := "Administrator"
	role := "admin"

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	user := models.User{
		Username: username,
		Password: string(hashedPassword),
		FullName: fullName,
		Role:     role,
	}

	// Check if exists
	var existing models.User
	if err := database.DB.Where("username = ?", username).First(&existing).Error; err == nil {
		fmt.Println("User admin already exists")
		return
	}

	if err := database.DB.Create(&user).Error; err != nil {
		log.Fatalf("Failed to create user: %v", err)
	}

	fmt.Printf("Successfully created account:\nUsername: %s\nPassword: %s\n", username, password)
}
