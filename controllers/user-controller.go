package controllers

import (
	"net/http"
	"strconv"

	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/gin-gonic/gin"
)

func GetAllUsers(ctx *gin.Context) {
	var users []models.User

	if err := database.DB.Preload("Cart").Find(&users).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch users",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

func GetUserDetail(ctx *gin.Context) {
	idParam := ctx.Param("id")

	var user models.User

	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"errror": "Invalid user ID format"})
		return
	}

	if err := database.DB.Preload("Orders").Preload("Cart").First(&user, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Do not return password in response
	ctx.JSON(http.StatusOK, user)
}

func GetProfile(ctx *gin.Context) {
	// 1. Ambil ID user dari Context (menggunakan fungsi pembantu yang konsisten)
    userID, err := getIDFromContext(ctx) 
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }

    var user models.User
    // 2. Cari user di database untuk mendapatkan profile lengkap (termasuk relasi jika ada)
    if err := database.DB.First(&user, userID).Error; err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "User profile not found"})
        return
    }

    // 3. Mengembalikan objek user lengkap
    ctx.JSON(http.StatusOK, gin.H{
        "user": user, 
    })
}

func DeleteUser(ctx *gin.Context) {
	// Get the :id parameter from URL
	idParam := ctx.Param("id")

	// Convert to uint
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid user ID",
		})
		return
	}

	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	// Prevent deleting root admin (optional safety)
	if user.Admin {
		ctx.JSON(http.StatusForbidden, gin.H{
			"error": "Cannot delete admin account",
		})
		return
	}

	if err := database.DB.Delete(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete user",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
	})
}

func UpdateProfile(ctx *gin.Context) {
	userID, err := getIDFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input models.UpdateProfileInput 
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Update field yang diperbolehkan
	if input.Username != "" {
		user.Username = input.Username
	}
	if input.Email != "" {
		user.Email = input.Email
	}
	
	database.DB.Save(&user)

	ctx.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully", "user": user})
}

func UpdateUser(ctx *gin.Context) {
    // 1. Ambil ID user yang akan diubah dari URL
    id := ctx.Param("id")
    userID, err := strconv.ParseUint(id, 10, 64)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
        return
    }

    // 2. Bind Input (menggunakan model input khusus Admin)
    var input models.UpdateUserAdminInput 
    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user models.User
    // 3. Cari user berdasarkan ID dari URL
    if err := database.DB.First(&user, userID).Error; err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }
    
    // 4. Update Field
    if input.Username != "" {
        user.Username = input.Username
    }
    if input.Email != "" {
        user.Email = input.Email
    }
    
    // Perubahan Hak Akses Admin (Hanya bisa diubah oleh Admin)
    if input.Admin != nil {
        user.Admin = *input.Admin 
    }

    database.DB.Save(&user)

    ctx.JSON(http.StatusOK, gin.H{"message": "User updated successfully (Admin)", "user": user})
}