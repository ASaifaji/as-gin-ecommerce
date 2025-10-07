package controllers

import (
	"net/http"
	"strconv"

	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/gin-gonic/gin"
)

func AddProductToCart(ctx *gin.Context) {
	var input models.AddcartItemInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user ID from JWT claims set in middleware
	userIDValue, exists := ctx.Get("id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDValue.(uint)

	// Find or create cart for this user
	var cart models.Cart
	if err := database.DB.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		// Create new cart if not found
		cart = models.Cart{UserID: userID}
		if err := database.DB.Create(&cart).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
			return
		}
	}

	// Check if product exists
	var product models.Product
	if err := database.DB.First(&product, input.ProductID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Check if product already in cart
	var existingItem models.CartItem
	err := database.DB.Where("cart_id = ? AND product_id = ?", cart.ID, input.ProductID).First(&existingItem).Error
	if err == nil {
		// Product exists, update quantity
		existingItem.Quantity += int(input.Quantity)
		if err := database.DB.Save(&existingItem).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
			return
		}
	} else {
		// Add new item
		newItem := models.CartItem{
			CartID:    cart.ID,
			ProductID: input.ProductID,
			Quantity:  int(input.Quantity),
		}
		if err := database.DB.Create(&newItem).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add product to cart"})
			return
		}
	}

	// Reload the cart with items
	var updatedCart models.Cart
	if err := database.DB.Preload("Items.Product").First(&updatedCart, cart.ID).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load cart"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Product added to cart successfully",
		"cart":    updatedCart,
	})
}

func UpdateCartItem(ctx *gin.Context) {
	itemID, err := strconv.ParseUint(ctx.Param("itemId"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
		return
	}

	var input models.UpdateCartItemQuantityInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDValue, exists := ctx.Get("id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDValue.(uint)

	var cart models.Cart
	if err := database.DB.Where("user_id = ?", userID).First(&cart).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	var item models.CartItem
	if err := database.DB.Where("id = ? AND cart_id = ?", itemID, cart.ID).First(&item).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	item.Quantity = int(input.Quantity)
	if err := database.DB.Save(&item).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
		return
	}
	
	if err := database.DB.Preload("Product").First(&item, item.ID).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load updated item"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Cart item updated successfully",
		"item":    item,
	})
}