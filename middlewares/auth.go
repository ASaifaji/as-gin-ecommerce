package middlewares

import (
	"net/http"
	"strings"

	"github.com/ASaifaji/as-gin-ecommerce/utils"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware checks JWT from Authorization header
func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		var tokenStr string

		if authHeader != "" {
			tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
		} else {
			cookie, err := ctx.Cookie("auth_token")
			if err != nil {
				ctx.Redirect(http.StatusFound, "/login")
				ctx.Abort()
				return 
			}
			tokenStr = cookie
		}
		
		claims, err := utils.ValidateJWT(tokenStr)
		if err != nil {
			ctx.Redirect(http.StatusFound, "/login")
			ctx.Abort()
		}

		// Put claims into Gin
		ctx.Set("id", claims.UserID)
		ctx.Set("email", claims.Email)
		ctx.Set("admin", claims.Admin)

		ctx.Next()
	}
}