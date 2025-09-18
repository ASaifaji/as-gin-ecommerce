package routes

import (
	"net/http"

	"github.com/ASaifaji/as-gin-ecommerce/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		apiUser := api.Group("/user")
		{
			apiUser.GET("id/:id", func(ctx *gin.Context) {
				ctx.JSON(200, nil)
			})
			apiUser.GET("username/:username", func(ctx *gin.Context) {
				ctx.JSON(200, nil)
			})
			apiUser.POST("", func(ctx *gin.Context) {
				controllers.RegisterUser(ctx)
			})
		}

		// apiProduct := api.Group("/Product")
		// {
		// 	apiProduct.GET("/", func(ctx *gin.Context) {
		// 		ctx.JSON(200, nil)
		// 	})
		// }

		// apiCategory := api.Group("/Category")
		// {
		// 	apiCategory.GET("/", func(ctx *gin.Context) {
		// 		ctx.JSON(200, nil)
		// 	})
		// }

		// apiCart := api.Group("/Cart")
		// {
		// 	apiCart.GET("/", func(ctx *gin.Context) {
		// 		ctx.JSON(200, nil)
		// 	})
		// }

		// apiOrder := api.Group("/Order")
		// {
		// 	apiOrder.GET("/", func(ctx *gin.Context) {
		// 		ctx.JSON(200, nil)
		// 	})
		// }

		// apiOrderItem := api.Group("/OrderItem")
		// {
		// 	apiOrderItem.GET("/", func(ctx *gin.Context) {
		// 		ctx.JSON(200, nil)
		// 	})
		// }

		// apiPayment := api.Group("/Payment")
		// {
		// 	apiPayment.GET("/", func(ctx *gin.Context) {
		// 		ctx.JSON(200, nil)
		// 	})
		// }
	}

	view := r.Group("")
	{
		view.GET("/register", controllers.ViewRegister)
		view.GET("/register/success", func(ctx *gin.Context) {
			ctx.HTML(http.StatusOK, "register_success.html", gin.H{
				"message": "User registered successfully!",
			})
    	})
	}
}