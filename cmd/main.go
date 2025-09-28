package main

import (
	"io"
	"os"

	"github.com/ASaifaji/as-gin-ecommerce/config"
	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/middlewares"
	"github.com/ASaifaji/as-gin-ecommerce/routes"
	"github.com/gin-gonic/gin"
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

	server.LoadHTMLGlob("templates/**/*.html")

	server.Use(
		middlewares.Logger(),
	)
	routes.SetupRoutes(server)

	server.Run()
}