package controllers

import (
	"net/http"

	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/ASaifaji/as-gin-ecommerce/utils"
	"github.com/gin-gonic/gin"
)

func ViewLogin(ctx *gin.Context) {
    ctx.HTML(http.StatusOK, "login.html", gin.H{"title": "Login"})
}

func Login(ctx *gin.Context) {
    var input models.LoginInput
    if err := ctx.ShouldBind(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user models.User
    if err := database.DB.Where("username = ? OR email = ?", input.Login, input.Login).First(&user).Error; err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username or Email"})
        return
    }

    if !utils.CheckPassword(user.Password, input.Password) {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "password"})
        return
    }

    token, _ := utils.GenerateJWT(user.ID, user.Email, user.Admin)

    ctx.SetCookie("auth_token", token, 3600, "/", "", false, true)

	ctx.Redirect(http.StatusFound, "/loggedin")
}