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
		// Users
		api.POST("/register", func(ctx *gin.Context) { controllers.Register(ctx) })
		api.POST("/login", func(ctx *gin.Context) { controllers.Login(ctx) })
		api.POST("/logout", middlewares.Logout)
		api.GET("/profile", middlewares.AuthMiddleware(), controllers.GetProfile)
		api.PUT("/profile", middlewares.AuthMiddleware(), controllers.UpdateProfile)
		api.PUT("/profile/password", middlewares.AuthMiddleware(), controllers.UpdatePassword)
		api.GET("/users", middlewares.AuthMiddleware(), middlewares.AuthAdmin(), controllers.GetAllUsers)
		api.GET("/users/:id", middlewares.AuthMiddleware(), controllers.GetUserDetail)
		api.PUT("/users/:id", middlewares.AuthMiddleware(), middlewares.AuthAdmin(), controllers.UpdateUser)
		api.DELETE("/users/:id", middlewares.AuthMiddleware(), middlewares.AuthAdmin(), controllers.DeleteUser)

		// Product
		api.GET("/products", controllers.GetAllProducts)
		api.GET("/products/:id", controllers.GetProductDetail)
		api.POST("/products", middlewares.AuthMiddleware(), middlewares.AuthAdmin(), controllers.CreateProduct)
		api.PUT("/products/:id", middlewares.AuthMiddleware(), middlewares.AuthAdmin(), controllers.UpdateProduct)
		api.DELETE("/products/:id", middlewares.AuthMiddleware(), middlewares.AuthAdmin(), controllers.DeleteProduct)

		// Order
		api.POST("/orders", middlewares.AuthMiddleware(), controllers.CreateOrder)
		api.GET("/orders", middlewares.AuthMiddleware(), controllers.GetAllOwnOrders)
		api.GET("/orders/:id", middlewares.AuthMiddleware(), controllers.GetOrderDetail)
		api.GET("/admin/orders", middlewares.AuthMiddleware(), middlewares.AuthAdmin(), controllers.GetAllOrders)
		api.PUT("/orders/:id/status", middlewares.AuthMiddleware(), middlewares.AuthAdmin(), controllers.UpdateOrderStatus)


		// Category
		api.GET("/categories", controllers.GetAllCategories)
		api.GET("/categories/:id", controllers.GetCategories)
		api.POST("/categories", middlewares.AuthMiddleware(), middlewares.AuthAdmin(), controllers.CreateCategory)
		api.PUT("/categories/:id", middlewares.AuthMiddleware(), middlewares.AuthAdmin(), controllers.UpdateCategories)
		api.DELETE("/categories/:id", middlewares.AuthMiddleware(), middlewares.AuthAdmin(), controllers.DeleteCategory)
		api.POST("/categories/recount", middlewares.AuthMiddleware(), middlewares.AuthAdmin(), controllers.RecountAllCategories)

		// Cart
		api.GET("/cart", middlewares.AuthMiddleware(), controllers.GetOwnCart)
		api.POST("/cart", middlewares.AuthMiddleware(), controllers.AddProductToCart)
		api.PUT("/cart/:itemId", middlewares.AuthMiddleware(), controllers.UpdateCartItem)
		api.DELETE("/cart/:itemId", middlewares.AuthMiddleware(), controllers.RemoveCartItem)
		api.DELETE("/cart/clear", middlewares.AuthMiddleware(), controllers.ClearCart)

		// Reviews
		api.GET("/reviews/:id", controllers.GetReviewByID)
		api.GET("/products/:id/reviews", controllers.GetReviewForProduct)
		api.POST("/products/:id/reviews", middlewares.AuthMiddleware(), controllers.CreateReview)
		api.PUT("/reviews/:id", middlewares.AuthMiddleware(), controllers.UpdateReview)
		api.DELETE("/reviews/:id", middlewares.AuthMiddleware(), controllers.DeleteReview)
		api.DELETE("/reviews/:id/admin", middlewares.AuthMiddleware(), middlewares.AuthAdmin(), controllers.DeleteReviewByAdmin)

		// google OAuth2
		api.GET("auth/google/login", controllers.GoogleLogin)
		api.GET("auth/google/callback", controllers.GoogleCallback)

	}

	view := r.Group("")
	{
		vHome := view.Group("")
		{
			vHome.GET("", func(ctx *gin.Context) {
				controllers.ViewHome(ctx)
			})

			vHome.GET("/loggedin", middlewares.AuthMiddleware(), func(ctx *gin.Context) {
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
}
