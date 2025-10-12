package models

import "time"

//  product model 
type Product struct {
    ID            uint      `gorm:"primaryKey" json:"id"`
    Name          string    `gorm:"size:200;not null" json:"name"`
    Description   string    `gorm:"type:text" json:"description"`
    Price         int64     `gorm:"not null" json:"price"` // store in cents (129900 = Rp1299.00)
    StockQuantity int       `gorm:"not null;default:0" json:"stock_quantity"`
    CategoryID    uint      `json:"category_id"`
    IsActive      bool      `gorm:"default:true" json:"is_active"`
    Category      Category  `json:"category"`
    CreatedAt     time.Time `json:"created_at"`
    UpdatedAt     time.Time `json:"updated_at"`
}