package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Logout(ctx *gin.Context) {
	// Overwrite the cookie with an empty value and set it expired
	ctx.SetCookie("Authorization", "", -1, "/", "localhost", false, true)

	ctx.Redirect(http.StatusFound, "/")
}
