package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/gin-gonic/gin"
)

func CreateOrder(ctx *gin.Context) {
	userID, err := getIDFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unathourized"})
		return
	}

	fmt.Printf("User ID %d mencoba membuat order\n", userID)

	// TO DO :
	// a. Ambil data keranjang (Cart) pengguna dari DB
	// b. Cek stok produk.
	// c. Buat Order dan Order Items baru.
	// d. Kosongkan keranjang

	//Respon sukses
	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Order created successfully",
		"user_id": userID,
	})
}

func GetAllOwnOrders(ctx *gin.Context) {
	userID, err := getIDFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var orders []models.Order
	// 1. Ambil order milik user dari database
	if err := database.DB.Where("user_id = ?", userID).Find(&orders).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	// 2. Respons Sukses
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Successfully fetched user orders",
		"orders":  orders,
	})
}

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
	if err := database.DB.Preload("OrderItems").First(&order, orderID).Error; err != nil { 
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	if order.UserID != userID && !userIDIsAdmin(userID) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Successfully fetched order detail",
		"order":   order,
	})
}

func GetAllOrders(ctx *gin.Context) {
	var orders []models.Order
	if err := database.DB.Preload("User").Find(&orders).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch all orders"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Successfully fetched all orders (Admin View)",
		"orders":  orders,
	})
}

func UpdateOrderStatus(ctx *gin.Context) {
	orderIdStr := ctx.Param("id")
	orderID, err := strconv.ParseUint(orderIdStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID format"})
		return
	}

	var input struct {
		Status string `json:"status" binding:"required"`
	}
    // 1. Bind input status baru
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var order models.Order
    // 2. Cari order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// 3. Update status (Placeholder)
    // TODO: Validasi status yang valid (misal: "processing", "shipped", "completed")
	order.Status = input.Status
	database.DB.Save(&order)

    // 4. Respons Sukses
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Order status updated successfully",
		"order": order,
	})
}

func userIDIsAdmin(id uint) bool {
	return false 
}