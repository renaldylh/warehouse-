package http

import (
	"net/http"
	"time"
	"warehouse-wms-backend/internal/models"
	"warehouse-wms-backend/internal/repository"
	"warehouse-wms-backend/pkg/utils"
	"warehouse-wms-backend/pkg/logger"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"go.uber.org/zap"
)

type AuthHandler struct {
	repo repository.UserRepository
}

func NewAuthHandler(repo repository.UserRepository) *AuthHandler {
	return &AuthHandler{repo}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid registration data"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)

	if err := h.repo.Create(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User registration failed (username may exist)"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Registration successful"})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid login format"})
		return
	}

	user, err := h.repo.GetByUsername(credentials.Username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Account not found or invalid credentials"})
		return
	}

	// 1. Check Account Lockout (Google Standard)
	if user.LockedUntil != nil && user.LockedUntil.After(time.Now()) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Account temporarily locked due to too many failed attempts. Try again later."})
		return
	}

	// 2. Validate Password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password))
	if err != nil {
		// Increment login attempts
		user.LoginAttempts++
		if user.LoginAttempts >= 5 {
			lockout := time.Now().Add(15 * time.Minute)
			user.LockedUntil = &lockout
			user.LoginAttempts = 0
			logger.Log.Warn("Account locked", zap.String("username", user.Username))
		}
		h.repo.Update(user)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// 3. Reset attempts on success
	user.LoginAttempts = 0
	user.LockedUntil = nil

	// 4. Generate Tokens (Access & Refresh)
	token, _ := utils.GenerateToken(user.ID, user.Username, user.Role)
	refreshToken := utils.GenerateRandomString(32)
	user.RefreshToken = refreshToken
	h.repo.Update(user)

	logger.Log.Info("User logged in", zap.String("username", user.Username))

	c.JSON(http.StatusOK, gin.H{
		"token":         token,
		"refresh_token": refreshToken,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"role":     user.Role,
		},
	})
}
