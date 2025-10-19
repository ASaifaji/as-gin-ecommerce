package controllers

import (
	"errors"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func CreateProduct(ctx *gin.Context) {
	var input models.ProductInput

	// Bind JSON body to ProductInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Check if the referenced category exists
	var category models.Category
	if err := database.DB.First(&category, input.CategoryID).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid category ID",
		})
		return
	}

	if input.StockQuantity < 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Stock cannot be negative"})
		return
	}

	product := models.Product{
		Name:          input.Name,
		Description:   input.Description,
		Price:         input.Price,
		StockQuantity: input.StockQuantity,
		CategoryID:    input.CategoryID,
		IsActive:      input.IsActive,
	}

	if err := database.DB.Create(&product).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create product",
		})
		return
	}

	// update jumlah produk kategori ini
	UpdateCategoryProductCount(product.CategoryID)

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Product created successfully",
		"product": gin.H{
			"id":             product.ID,
			"name":           product.Name,
			"description":    product.Description,
			"price":          product.Price,
			"stock_quantity": product.StockQuantity,
			"category_id":    product.CategoryID,
			"is_active":      product.IsActive,
		},
	})
}

func GetAllProducts(ctx *gin.Context) {
	var products []models.Product

	if err := database.DB.Preload("Category").Find(&products).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"products": products,
	})
}

func GetProductDetail(ctx *gin.Context) {
	idParam := ctx.Param("id")

	productID, err := strconv.Atoi(idParam)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid product ID",
		})
		return
	}

	var product models.Product

	if err := database.DB.Preload("Category").First(&product, productID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": product,
	})
}

func DeleteProduct(ctx *gin.Context) {
	id := ctx.Param("id")

	var product models.Product
	if err := database.DB.First(&product, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "Product not found",
		})
		return
	}

	// simpan categoryID sebelum delete
	categoryID := product.CategoryID

	if err := database.DB.Delete(&product).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete product",
		})
		return
	}

	// update jumlah produk kategori ini
	UpdateCategoryProductCount(categoryID)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Product deleted successfully",
	})
}

func UpdateProduct(ctx *gin.Context) {
	id := ctx.Param("id")
	productID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID format"})
		return
	}

	var input models.UpdateProductInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var product models.Product
	if err := database.DB.First(&product, productID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	
	updateMap := make(map[string]interface{})
	if input.Name != "" {
		updateMap["name"] = input.Name
	}
	if input.Description != "" {
		updateMap["description"] = input.Description
	}
	if input.Price > 0 {
		updateMap["price"] = input.Price
	}
	if input.StockQuantity >= 0 {
		updateMap["stock_quantity"] = input.StockQuantity
	}
	if input.CategoryID > 0 {
		updateMap["category_id"] = input.CategoryID
	}
	// boolean
	updateMap["is_active"] = input.IsActive

	if err := database.DB.Model(&product).Updates(updateMap).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	// Reload product with category (ambil category_id terbaru)
	if err := database.DB.Preload("Category").First(&product, productID).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reload product"})
		return
	}
	newCategoryID := product.CategoryID

	if oldCategoryID != newCategoryID {
		UpdateCategoryProductCount(oldCategoryID)
		UpdateCategoryProductCount(newCategoryID)
	} else {
		UpdateCategoryProductCount(newCategoryID)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Product updated successfully",
		"product": product,
	})
}

func UploadProductImages(ctx *gin.Context) {
    productIDStr := ctx.Param("id")
    productID, err := strconv.ParseUint(productIDStr, 10, 64)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
        return
    }

    var product models.Product
    if err := database.DB.First(&product, productID).Error; err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
        return
    }

    // Handle Multiple File Uploads
    form, err := ctx.MultipartForm()
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error parsing form: " + err.Error()})
        return
    }
    
    files := form.File["images"]

    if len(files) == 0 {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "No images uploaded"})
        return
    }

    var imageModels []models.ProductImage
    for _, file := range files {
        extension := filepath.Ext(file.Filename)
        uniqueFilename := uuid.New().String() + extension
        dst := filepath.Join("uploads", "products", uniqueFilename)

        if err := ctx.SaveUploadedFile(file, dst); err != nil {
            ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image: " + err.Error()})
            return
        }
        
        imageModels = append(imageModels, models.ProductImage{
            ProductID: uint(productID),
            ImagePath: dst,
        })
    }

    // Simpan Referensi Gambar ke Database
    if err := database.DB.Create(&imageModels).Error; err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image records"})
        return
    }

    // Kembalikan Produk Lengkap dengan Gambar Baru
    database.DB.Preload("Category").Preload("Images").First(&product, productID)

    ctx.JSON(http.StatusOK, gin.H{
        "message": "Images uploaded successfully",
        "product": product,
    })
}

func DeleteProductImage(ctx *gin.Context) {
	imageIDStr := ctx.Param("image_id")
	imageID, err := strconv.ParseUint(imageIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Format ID gambar tidak valid"})
		return
	}

	var image models.ProductImage
	if err := database.DB.First(&image, imageID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Gambar tidak ditemukan"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Kesalahan database saat mencari gambar"})
		return
	}

	// Hapus file fisik dari storage
	if image.ImagePath != "" {
		if err := os.Remove(image.ImagePath); err != nil {
			// PENTING: Jika file GAGAL dihapus (misal: sudah hilang),
			// kita hanya mencatat error tapi TETAP LANJUT
			// untuk menghapus record dari database.
			log.Printf("Peringatan: Gagal menghapus file %s: %v\n", image.ImagePath, err)
		}
	}

	// Hapus record dari database
	if err := database.DB.Delete(&image).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus record gambar dari database"})
		return
	}
	
	ctx.JSON(http.StatusOK, gin.H{"message": "Gambar berhasil dihapus"})
}
// === NEW: total products ===
func CountProducts(ctx *gin.Context) {
	var total int64
	if err := database.DB.Model(&models.Product{}).Count(&total).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count products"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"total_products": total})
}
