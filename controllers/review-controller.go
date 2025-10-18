package controllers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateReview(ctx *gin.Context) {
	userID, exists := ctx.Get("id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	userIDUint, ok := userID.(uint)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format in context"})
		return
	}

	productIDStr := ctx.Param("id")
	productID, err := strconv.ParseUint(productIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var input models.ReviewInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var product models.Product
	if err := database.DB.First(&product, productID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error checking product"})
		return
	}

	// Business Logic: Check if User Already Reviewed
	var existingReview models.Review
	err = database.DB.Where("product_id = ? AND user_id = ?", productID, userIDUint).First(&existingReview).Error
	
	if err == nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": "You have already reviewed this product"})
		return
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error checking existing review"})
		return
	}

	review := models.Review{
		Rating:    input.Rating,
		Comment:   input.Comment,
		ProductID: uint(productID),
		UserID:    userIDUint,
	}

	if err := database.DB.Create(&review).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create review"})
		return
	}

	// You might want to preload the User data to return the user's name
	database.DB.Preload("User").First(&review, review.ID)

	ctx.JSON(http.StatusCreated, review)
}

func GetReviewByID(ctx *gin.Context) {
	reviewIDStr := ctx.Param("id")
	reviewID, err := strconv.ParseUint(reviewIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	var review models.Review
	err = database.DB.Preload("User").First(&review, reviewID).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
			return
		}
		
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	ctx.JSON(http.StatusOK, review)
}

func GetReviewForProduct(ctx *gin.Context) {
	productIDStr := ctx.Param("id")
	productID, err := strconv.ParseUint(productIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var product models.Product
	if err := database.DB.First(&product, productID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	var reviews []models.Review
	err = database.DB.Preload("User").Where("product_id = ?", productID).Order("created_at DESC").Find(&reviews).Error

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve reviews"})
		return
	}

	ctx.JSON(http.StatusOK, reviews)
}

func UpdateReview(ctx *gin.Context) {
	userID, exists := ctx.Get("id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	userIDUint := userID.(uint)

	reviewIDStr := ctx.Param("id")
	reviewID, err := strconv.ParseUint(reviewIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	var input models.ReviewInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var review models.Review
	if err := database.DB.First(&review, reviewID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Authorization Check
	// Check if the authenticated user is the one who wrote the review.
	if review.UserID != userIDUint {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to update this review"})
		return
	}

	review.Rating = input.Rating
	review.Comment = input.Comment

	if err := database.DB.Save(&review).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update review"})
		return
	}

	database.DB.Preload("User").First(&review, review.ID)
	ctx.JSON(http.StatusOK, review)
}

func DeleteReview(ctx *gin.Context) {
	userID, exists := ctx.Get("id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	userIDUint := userID.(uint)

	reviewIDStr := ctx.Param("id")
	reviewID, err := strconv.ParseUint(reviewIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	var review models.Review
	if err := database.DB.First(&review, reviewID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Authorization Check
	// Check if the authenticated user is the one who wrote the review.
	if review.UserID != userIDUint {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to delete this review"})
		return
	}

	if err := database.DB.Delete(&review).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete review"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Review deleted successfully"})
}

func DeleteReviewByAdmin(ctx *gin.Context) {
	reviewIDStr := ctx.Param("id")
	reviewID, err := strconv.ParseUint(reviewIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	var review models.Review
	if err := database.DB.First(&review, reviewID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if err := database.DB.Delete(&review).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete review"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Review deleted successfully"})
}

func CountReviews(ctx *gin.Context) {
	var total int64
	if err := database.DB.Model(&models.Review{}).Count(&total).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count reviews"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"total_reviews": total})
}