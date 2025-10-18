package controllers

import (
	"net/http"
	"time"

	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/ASaifaji/as-gin-ecommerce/utils"
	"github.com/gin-gonic/gin"
)

func ViewRegister(ctx *gin.Context) {
    ctx.HTML(http.StatusOK, "register.html", gin.H{})
}

func Register(ctx *gin.Context) {
    var input models.RegisInput
    if err := ctx.ShouldBind(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Hash password
    hashedPassword, err := utils.HashPassword(input.Password)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    user := models.User{
        Username: input.Username,
        Email:    input.Email,
        Password: hashedPassword,
    }

    if err := database.DB.Create(&user).Error; err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    var User models.User
	if err := database.DB.Where("username = ?", input.Username).First(&User).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

    cart := models.Cart{
        UserID: User.ID,
        CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
    }

    if err := database.DB.Create(&cart).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

    ctx.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}