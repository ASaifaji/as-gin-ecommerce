package controllers

import (
	"net/http"

	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/ASaifaji/as-gin-ecommerce/utils"
	"github.com/gin-gonic/gin"
)

func ViewRegister(ctx *gin.Context) {
    ctx.HTML(http.StatusOK, "register.html", gin.H{})
}

func Register(c *gin.Context) {
    var input models.RegisInput
    if err := c.ShouldBind(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Hash password
    hashedPassword, err := utils.HashPassword(input.Password)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    user := models.User{
        Username: input.Username,
        Email:    input.Email,
        Password: hashedPassword,
    }

    if err := database.DB.Create(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}