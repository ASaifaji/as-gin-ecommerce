package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ViewHome(ctx *gin.Context) {
	token := ctx.GetHeader("Authorization")
	if token == "" {
		ctx.HTML(http.StatusOK, "index.html", nil)
		return
	}
	ctx.Redirect(http.StatusFound, "/loggedin")
}

func ViewLoggedin(ctx *gin.Context) {
	id, _ := ctx.Get("id")
	email, _ := ctx.Get("email")
	admin, _ := ctx.Get("admin")

	ctx.HTML(http.StatusOK, "loggedin.html", gin.H{
		"id": id,
		"email": email,
		"admin":  admin,
	})
}