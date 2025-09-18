package database

import (
	"fmt"
	"log"

	"github.com/ASaifaji/as-gin-ecommerce/config"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
    cfg := config.AppConfig

    dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
        cfg.DBUser, cfg.DBPass, cfg.DBHost, cfg.DBPort, cfg.DBName,
    )

    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    DB = db
    fmt.Println("Database connected successfully!")

	DB.AutoMigrate(
		&models.User{},
		// &models.Category{},
		// &models.Product{},
		// &models.CartItem{},
		// &models.Order{},
		// &models.OrderItem{},
	)
}
