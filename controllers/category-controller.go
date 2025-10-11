package controllers

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/gin-gonic/gin"
)

func CreateCategory(ctx *gin.Context) {
	var input models.CategoryInput

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	slug := strings.ToLower(strings.ReplaceAll(input.Name, " ", "-"))

	var existing models.Category
	if err := database.DB.Where("slug = ?", slug).First(&existing).Error; err == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Category already exists"})
		return
	}

	category := models.Category{
		Name:      input.Name,
		Slug:      slug,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := database.DB.Create(&category).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message":  "Category created successfully",
		"category": category,
	})
}

func GetAllCategories(ctx *gin.Context) {
	var categories []models.Category

	if err := database.DB.Preload("Products").Find(&categories).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve categories"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":    "Categories retrieved successfully",
		"categories": categories,
	})
}

func DeleteCategory(ctx *gin.Context) {
	id := ctx.Param("id")

	var category models.Category
	if err := database.DB.First(&category, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	// Delete the category
	if err := database.DB.Delete(&category).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete category"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Category deleted successfully",
		"id":      category.ID,
	})
}

func UpdateCategories(ctx *gin.Context) {
	idParam := ctx.Param("id")
	categoryID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID format"})
		return
	}

	var input models.UpdateCategoryInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var category models.Category
	if err := database.DB.First(&category, categoryID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	updateMap := make(map[string]interface{})

	if input.Name != "" {
		updateMap["name"] = input.Name
	}

	if len(updateMap) == 0 {
		ctx.JSON(http.StatusOK, gin.H{"message": "No changes submitted", "category": category})
		return
	}
	if err := database.DB.Model(&category).Updates(updateMap).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update category"})
		return
	}

	database.DB.First(&category, categoryID)

	ctx.JSON(http.StatusOK, gin.H{
		"message":  "Category updated successfully",
		"category": category,
	})
}
