package main

import (
	"io"
	"os"
	"time"

	"github.com/ASaifaji/as-gin-ecommerce/config"
	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/middlewares"
	"github.com/ASaifaji/as-gin-ecommerce/routes"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func setupLogOutput() {
	f, _ := os.Create("gin.log")
	gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
}

func main () {
	// Setup conf and db
	config.LoadConfig()
	database.ConnectDB()

	setupLogOutput()
	
	server := gin.Default()

	server.SetTrustedProxies([]string{"127.0.0.1", "192.168.1.15"})

	// server.LoadHTMLGlob("templates/**/*.html")

	server.Use(
		middlewares.Logger(),
		cors.New(cors.Config{
			AllowOrigins:		[]string{"http://localhost:5173"},
			AllowMethods:		[]string{"GET", "POST", "PUT", "POST", "DELETE", "OPTIONS"},
			AllowHeaders:		[]string{"Origin", "Content-Type", "Accept", "Authorization"},
			ExposeHeaders:		[]string{"Content-Length"},
			AllowCredentials:	true,
			MaxAge:				12*time.Hour,
		}),
	)
	routes.SetupRoutes(server)

	server.Run()
}	