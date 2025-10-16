package controllers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/ASaifaji/as-gin-ecommerce/config"
	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/ASaifaji/as-gin-ecommerce/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

func GoogleLogin(ctx *gin.Context) {
    url := config.GoogleOAuthConfig.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
    ctx.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallback(ctx *gin.Context) {
	code := ctx.Query("code")
	if code == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "missing code"})
		return
	}

	token, err := config.GoogleOAuthConfig.Exchange(ctx, code)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange token"})
		return
	}

	client := config.GoogleOAuthConfig.Client(ctx, token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user info"})
		return
	}
	defer resp.Body.Close()

	var userInfo map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&userInfo)

    email, _ := userInfo["email"].(string)
	if email == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "email not provided by google"})
		return
	}

    var user models.User
    result := database.DB.Where("email = ?", email).First(&user)

    if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound{
			// User doesn’t exist → create new Google account
			user = models.User{
				Email:    email,
				Password: "", // Google users don’t need local password
				Provider: "google",
				Admin:	  false,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			}
			if strings.Contains(email, "@") {
				user.Username = strings.Split(email, "@")[0]
			}
			if err := database.DB.Create(&user).Error; err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
				return
			}
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
			return
		}
        
    }

    // Generate JWT with your function signature
	jwt, _ := utils.GenerateJWT(user.ID, user.Email, user.Admin)

	ctx.SetCookie("auth_token", jwt, 3600, "/", "", false, true)

	ctx.Redirect(http.StatusFound, "/loggedin")

}

func SetPassword(ctx *gin.Context) {
    var input models.SetPasswordInput
    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user models.User
	UserId, _ := ctx.Get("id")
    if err := database.DB.Where("email = ?", UserId).First(&user).Error; err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found, try to re-login"})
        return
    }

	if user.Password != "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Password already Exists"})
	}
	
    // Hash new password
    hashed, err := utils.HashPassword(input.NewPassword)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    // Save new password
    user.Password = hashed
    database.DB.Save(&user)

    ctx.JSON(http.StatusOK, gin.H{"message": "Password set successfully, you can now log in locally with password"})
}

func UpdatePassword(ctx *gin.Context) {
	var input models.UpdatePasswordInput
    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user models.User
	UserId, _ := ctx.Get("id")
    if err := database.DB.Where("id = ?", UserId).First(&user).Error; err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found, try to re-login"})
        return
    }

	if !utils.CheckPassword(user.Password, input.OldPassword) {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Wrong Old Password"})
        return
    }

	// Hash new password
    hashed, err := utils.HashPassword(input.NewPassword)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    // Save new password
    user.Password = hashed
    database.DB.Save(&user)

    ctx.JSON(http.StatusOK, gin.H{"message": "Password set successfully, you can now log in locally with password"})
}