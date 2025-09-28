package models

import "time"

//  product model 
type Product struct{
	ID             uint      `gorm:"primaryKey"`
	Name           string    `json:"name" gorm:"size:255;not null"`
	Description    string    `json:"description" gorm:"type:text"`
	Price          float64   `json:"price" gorm:"type:decimal(10,2);not null"`
	StockQuantity  int       `json:"stock_quantity" gorm:"not null"`
	CategoryID     uint      `json:"category_id" gorm:"not null"` // foreign Key
	IsActive       bool      `json:"is_active" gorm:"default:true"`
	CreatedAt      time.Time
	UpdatedAt	   time.Time

	// relasi
	Category	   Category
}

// input product 
type ProductInput struct{
	Name          string  `json:"name" binding:"required,min=5,max=255"`
	Description   string  `json:"description" binding:"required,min=10"`
	Price         float64 `json:"price" binding:"required,gt=0"`
	StockQuantity int     `json:"stock_quantity" binding:"required,gte=0"`
	CategoryID    uint    `json:"category_id" binding:"required,gt=0"`
	IsActive 	  bool    `json:"is_active" binding:"required"`
}