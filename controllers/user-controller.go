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

	if err := database.DB.Find(&users).Error; err != nil {
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
    id := ctx.Param("id")
    var user models.User

    if err := database.DB.First(&user, id).Error; err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    // Do not return password in response
    ctx.JSON(http.StatusOK, gin.H{
        "id":       user.ID,
        "username": user.Username,
        "email":    user.Email,
        "admin":     user.Admin,
    })
}

func GetProfile(ctx *gin.Context) {
	// Claims already extracted by AuthMiddleware
	userID, _ := ctx.Get("id")
	email, _ := ctx.Get("email")
	admin, _ := ctx.Get("admin")

	ctx.JSON(http.StatusOK, gin.H{
		"id":       userID,
		"email":    email,
		"admin":     admin,
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