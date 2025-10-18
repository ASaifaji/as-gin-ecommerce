package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateOrder membuat order baru dari cart user
func CreateOrder(ctx *gin.Context) {
	userID, err := getIDFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Input structure
	var input struct {
		AddressID      uint   `json:"address_id" binding:"required"`
		ShippingMethod string `json:"shipping_method"`
		PaymentMethod  string `json:"payment_method"`
		ShippingCost   int64  `json:"shipping_cost"`
		Total          int64  `json:"total"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Ambil cart user
	var cart models.Cart
	if err := database.DB.Preload("Items.Product").Where("user_id = ?", userID).First(&cart).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Cart not found or empty"})
		return
	}

	// Validasi cart tidak kosong
	if len(cart.Items) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Cannot create order from empty cart"})
		return
	}

	// 2. Validasi address milik user
	var address models.Address
	if err := database.DB.Where("id = ? AND user_id = ?", input.AddressID, userID).First(&address).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid address ID or address does not belong to user"})
		return
	}

	// 3. Hitung total dan validasi stock
	var total int64 = 0
	orderItems := []models.OrderItem{}

	for _, cartItem := range cart.Items {
		// Cek stock
		if cartItem.Product.StockQuantity < cartItem.Quantity {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": fmt.Sprintf("Insufficient stock for product '%s'. Available: %d, Requested: %d",
					cartItem.Product.Name, cartItem.Product.StockQuantity, cartItem.Quantity),
			})
			return
		}

		itemTotal := cartItem.Product.Price * int64(cartItem.Quantity)
		total += itemTotal

		orderItems = append(orderItems, models.OrderItem{
			ProductID: cartItem.ProductID,
			Quantity:  cartItem.Quantity,
			Price:     cartItem.Product.Price, // Snapshot harga saat order
		})
	}

	// Tambahkan shipping cost
	total += input.ShippingCost

	// 4. Buat order dalam transaction
	err = database.DB.Transaction(func(tx *gorm.DB) error {
		// Create order
		order := models.Order{
			UserID: userID,
			Total:  total,
			Status: models.OrderPending,
		}

		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		// Create order items
		for i := range orderItems {
			orderItems[i].OrderID = order.ID
		}

		if err := tx.Create(&orderItems).Error; err != nil {
			return err
		}

		// Kurangi stock produk
		for _, item := range cart.Items {
			if err := tx.Model(&models.Product{}).
				Where("id = ?", item.ProductID).
				UpdateColumn("stock_quantity", gorm.Expr("stock_quantity - ?", item.Quantity)).
				Error; err != nil {
				return err
			}
		}

		// Kosongkan cart
		if err := tx.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order: " + err.Error()})
		return
	}

	// Response sukses
	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Order created successfully",
		"total":   total,
	})
}

// GetAllOwnOrders mengambil semua order milik user
func GetAllOwnOrders(ctx *gin.Context) {
	userID, err := getIDFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var orders []models.Order
	if err := database.DB.
		Preload("Items.Product").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&orders).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Successfully fetched user orders",
		"orders":  orders,
	})
}

// GetOrderDetail mengambil detail order berdasarkan ID
func GetOrderDetail(ctx *gin.Context) {
	userID, err := getIDFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	orderIDStr := ctx.Param("id")
	orderID, err := strconv.ParseUint(orderIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID format"})
		return
	}

	var order models.Order
	if err := database.DB.
		Preload("Items.Product").
		Preload("User").
		First(&order, orderID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Check if user owns this order or is admin
	if order.UserID != userID && !isUserAdmin(ctx) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Successfully fetched order detail",
		"order":   order,
	})
}

// GetAllOrders mengambil semua order (Admin only)
func GetAllOrders(ctx *gin.Context) {
	var orders []models.Order
	if err := database.DB.
		Preload("User").
		Preload("Items.Product").
		Order("created_at DESC").
		Find(&orders).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch all orders"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Successfully fetched all orders (Admin View)",
		"orders":  orders,
	})
}

// UpdateOrderStatus mengupdate status order (Admin only)
func UpdateOrderStatus(ctx *gin.Context) {
	orderIDStr := ctx.Param("id")
	orderID, err := strconv.ParseUint(orderIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID format"})
		return
	}

	var input models.UpdateOrderStatusInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validasi status yang valid
	validStatuses := []string{
		models.OrderPending,
		models.OrderProcessed,
		models.OrderShipped,
		models.OrderCompleted,
		models.OrderCanceled,
	}

	isValid := false
	for _, status := range validStatuses {
		if input.Status == status {
			isValid = true
			break
		}
	}

	if !isValid {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order status"})
		return
	}

	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Update status
	order.Status = input.Status
	if err := database.DB.Save(&order).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order status"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Order status updated successfully",
		"order":   order,
	})
}

// Helper function to check if user is admin
func isUserAdmin(ctx *gin.Context) bool {
	adminValue, exists := ctx.Get("admin")
	if !exists {
		return false
	}
	admin, ok := adminValue.(bool)
	return ok && admin
}