package database

import (
	"fmt"
	"log"
	"strings"
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
		&models.Address{},
		&models.Review{},
	)
	if err != nil {
        log.Fatal("Migration failed:", err)
    }
	DB.Migrator().CreateConstraint(&models.CartItem{}, "UQ_cart_product")
	DB.Exec("ALTER TABLE cart_items ADD CONSTRAINT uq_cart_product UNIQUE(cart_id, product_id);")

	seedAdmin()
	seedCategories()
	seedProducts()
}

func seedAdmin() {
	cfg := config.AdminConfig

	var user models.User
	if err := DB.Where("admin = ?", true).First(&user).Error; err != nil {
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

func seedCategories() {
	categories := []string{"Electronics", "Books", "Clothing", "Home & Kitchen", "Sports", "Toys", "Beauty"}
	

	for _, name := range categories {
		var category models.Category
		if err := DB.Where("name = ?", name).First(&category).Error; err != nil {
			newCategory := models.Category{
				Name:      name,
				Slug: strings.ToLower(strings.ReplaceAll(name, " ", "-")),
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			}
			DB.Create(&newCategory)
			fmt.Println("✅ Category created: " + name)
		} else {
			fmt.Println("ℹ️ Category already exists: " + name)
		}
	}
}

func seedProducts() {
	var count int64
	DB.Model(&models.Product{}).Count(&count)
	if count > 0 {
		fmt.Println("ℹ️ Products already exist, skipping seeding.")
		return
	}

	var categories []models.Category
	DB.Find(&categories)
	if len(categories) == 0 {
		fmt.Println("⚠️ No categories found, cannot seed products.")
		return
	}

	sampleProducts := []models.Product{
		{Name: "Smartphone", Description: "Latest model smartphone", Price: 69999, StockQuantity: 50, CategoryID: categories[0].ID, IsActive: true},
		{Name: "Laptop", Description: "High performance laptop", Price: 129999, StockQuantity: 30, CategoryID: categories[0].ID, IsActive: true},
		{Name: "Headphones", Description: "Noise-cancelling headphones", Price: 19999, StockQuantity: 100, CategoryID: categories[0].ID, IsActive: true},
		{Name: "Fiction Book", Description: "Bestselling fiction book", Price: 1499, StockQuantity: 200, CategoryID: categories[1].ID, IsActive: true},
		{Name: "Non-fiction Book", Description: "Informative non-fiction book", Price: 1999, StockQuantity: 150, CategoryID: categories[1].ID, IsActive: true},
		{Name: "T-Shirt", Description: "100% cotton t-shirt", Price: 999, StockQuantity: 300, CategoryID: categories[2].ID, IsActive: true},
		{Name: "Jeans", Description: "Comfortable denim jeans", Price: 3999, StockQuantity: 120, CategoryID: categories[2].ID, IsActive: true},
		{Name: "Blender", Description: "High-speed kitchen blender", Price: 4999, StockQuantity: 80, CategoryID: categories[3].ID, IsActive: true},
		{Name: "Vacuum Cleaner", Description: "Powerful vacuum cleaner", Price: 8999, StockQuantity: 60, CategoryID: categories[3].ID, IsActive: true},
		{Name: "Yoga Mat", Description: "Non-slip yoga mat", Price: 2499, StockQuantity: 150, CategoryID: categories[4].ID, IsActive: true},
		{Name: "Dumbbell Set", Description: "Adjustable dumbbell set", Price: 5999, StockQuantity: 70, CategoryID: categories[4].ID, IsActive: true},
		{Name: "Action Figure", Description: "Collectible action figure", Price: 2999, StockQuantity: 90, CategoryID: categories[5].ID, IsActive: true},
		{Name: "Board Game", Description: "Fun family board game", Price: 3499, StockQuantity: 110, CategoryID: categories[5].ID, IsActive: true},
		{Name: "Lipstick", Description: "Long-lasting lipstick", Price: 1299, StockQuantity: 250, CategoryID: categories[6].ID, IsActive: true},
		{Name: "Moisturizer", Description: "Hydrating facial moisturizer", Price: 2299, StockQuantity: 180, CategoryID: categories[6].ID, IsActive: true},
	}

	for _, product := range sampleProducts {
		product.CreatedAt = time.Now()
		product.UpdatedAt = time.Now()
		DB.Create(&product)
		fmt.Println("✅ Product created: " + product.Name)
	}
}