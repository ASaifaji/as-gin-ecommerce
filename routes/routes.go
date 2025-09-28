package routes

import (
	"net/http"

	"github.com/ASaifaji/as-gin-ecommerce/controllers"
	"github.com/ASaifaji/as-gin-ecommerce/middlewares"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.GET("/user/id/:id",middlewares.AuthMiddleware() , controllers.GetUserByID)
		api.GET("/user/username/:username",middlewares.AuthMiddleware() , controllers.GetUserByUsername)
		api.GET("/user/profile", middlewares.AuthMiddleware(), controllers.Profile)
		
		//	Register
		api.POST("/register", func(ctx *gin.Context) {
			controllers.Register(ctx)
		})

		// Login
		api.POST("/login", func(ctx *gin.Context) {
			controllers.Login(ctx)
		})

		api.POST("/set-password", controllers.SetPassword)

		apiAuth := api.Group("/")
		apiAuth.Use(middlewares.AuthMiddleware())
		{
			apiAuth.GET("/profile", controllers.Profile)
		}

		// google OAuth2
		api.GET("auth/google/login", controllers.GoogleLogin)
		api.GET("auth/google/callback", controllers.GoogleCallback)

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
		vHome := view.Group("")
		{
			vHome.GET("", func(ctx *gin.Context) {
				controllers.ViewHome(ctx)
			})

			vHome.GET("/loggedin", middlewares.AuthMiddleware(), func (ctx *gin.Context)  {
				controllers.ViewLoggedin(ctx)
			})
		}

		vRegister := view.Group("/register")
		{
			vRegister.GET("", controllers.ViewRegister)
			vRegister.GET("/success", func(ctx *gin.Context) {
				ctx.HTML(http.StatusOK, "register_success.html", gin.H{
					"message": "User registered successfully!",
				})
			})
		}

		vLogin := view.Group("/login")
		{
			vLogin.GET("", controllers.ViewLogin)
		}
	}

	r.POST("/logout", middlewares.Logout)
}