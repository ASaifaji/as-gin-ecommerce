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
	type CategoryWithCount struct {
		ID           uint      `json:"id"`
		Name         string    `json:"name"`
		Slug         string    `json:"slug"`
		CreatedAt    time.Time `json:"created_at"`
		UpdatedAt    time.Time `json:"updated_at"`
		ProductCount int64     `json:"product_count"`
	}

	var categories []CategoryWithCount

	err := database.DB.Table("categories AS c").
		Select(`c.id, c.name, c.slug, c.created_at, c.updated_at, 
		        COUNT(p.id) AS product_count`).
		Joins(`LEFT JOIN products p ON p.category_id = c.id`).
		Group(`c.id, c.name, c.slug, c.created_at, c.updated_at`).
		Order(`c.id ASC`).
		Scan(&categories).Error

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve categories", "detail": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"categories": categories})
}

func GetCategories(ctx *gin.Context) {
	idParam := ctx.Param("id")

	var category models.Category

	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"errror": "Invalid category ID format"})
		return
	}

	if err := database.DB.First(&category, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"id": category.ID,
		"name": category.Name,
		"slug": category.Slug,
		"created_at": category.CreatedAt,
		"updated_at": category.UpdatedAt,
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
		updateMap["slug"] = input.Slug
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

func UpdateCategoryProductCount(categoryID uint) {
	var count int64
	database.DB.Model(&models.Product{}).Where("category_id = ?", categoryID).Count(&count)
	database.DB.Model(&models.Category{}).Where("id = ?", categoryID).Update("product_count", count)
}

func RecountAllCategories(ctx *gin.Context) {
	sql := `
		UPDATE categories c
		LEFT JOIN (
			SELECT category_id, COUNT(*) AS cnt
			FROM products
			GROUP BY category_id
		) x ON x.category_id = c.id
		SET c.product_count = COALESCE(x.cnt, 0);
	`

	if err := database.DB.Exec(sql).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to recount categories"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Recount completed"})
}

// === NEW: total categories ===
func CountCategories(ctx *gin.Context) {
	var total int64
	if err := database.DB.Model(&models.Category{}).Count(&total).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count categories"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"total_categories": total})
}