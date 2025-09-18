package controllers

import (
	"net/http"

	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/ASaifaji/as-gin-ecommerce/utils"
	"github.com/gin-gonic/gin"
)

func RegisterUser(c *gin.Context) {
    var input models.UserInput
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

func GetUserByID(c *gin.Context) {
    id := c.Param("id")
    var user models.User

    if err := database.DB.First(&user, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    // Do not return password in response
    c.JSON(http.StatusOK, gin.H{
        "id":       user.ID,
        "username": user.Username,
        "email":    user.Email,
        "role":     user.Role,
    })
}

func GetUserByUsername(c *gin.Context) {
    username := c.Param("username")
    var user models.User

    if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    // Do not return password in response
    c.JSON(http.StatusOK, gin.H{
        "id":    user.ID,
        "username":  user.Username,
        "email": user.Email,
        "role":  user.Role,
    })
}

func ViewLogin(ctx *gin.Context) {
    ctx.HTML(http.StatusOK, "login.html", gin.H{})
}

func ViewRegister(ctx *gin.Context) {
    ctx.HTML(http.StatusOK, "register.html", gin.H{})
}