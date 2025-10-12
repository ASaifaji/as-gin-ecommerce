package database

import (
	"fmt"
	"log"
	"time"

	"github.com/ASaifaji/as-gin-ecommerce/config"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/ASaifaji/as-gin-ecommerce/utils"
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

	err = DB.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Product{},
		&models.Cart{},
		&models.CartItem{},
		&models.Order{},
		&models.OrderItem{},
	)
	if err != nil {
        log.Fatal("Migration failed:", err)
    }
	DB.Migrator().CreateConstraint(&models.CartItem{}, "UQ_cart_product")
	DB.Exec("ALTER TABLE cart_items ADD CONSTRAINT uq_cart_product UNIQUE(cart_id, product_id);")


	seedAdmin()
}

func seedAdmin() {
	cfg := config.AdminConfig

	var user models.User
	if err := DB.Where("email = ?", cfg.AdminEmail).First(&user).Error; err != nil {
		// Only create if not exist
		hashed, _ := utils.HashPassword(cfg.AdminPass) // default password
		admin := models.User{
			Username:  cfg.AdminUser,
			Email:     cfg.AdminEmail,
			Password:  hashed,
			Admin:     *utils.BoolPtr(true),
			Provider:  "local",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		DB.Create(&admin)
		fmt.Println("✅ Root admin account created: "+ admin.Email)
	} else {
		fmt.Println("ℹ️ Root admin account already exists")
	}
}