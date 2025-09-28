package controllers

import (
	"net/http"

	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/gin-gonic/gin"
)

func GetUserByID(ctx *gin.Context) {
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

func GetUserByUsername(ctx *gin.Context) {
    username := ctx.Param("username")
    var user models.User

    if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    // Do not return password in response
    ctx.JSON(http.StatusOK, gin.H{
        "id":    user.ID,
        "username":  user.Username,
        "email": user.Email,
        "admin":  user.Admin,
    })
}

func Profile(ctx *gin.Context) {
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