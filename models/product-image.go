package models

import "time"

// ProductImage holds the path to an image for a product.
type ProductImage struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    ProductID uint      `gorm:"not null;index" json:"product_id"` // Foreign key
    ImagePath string    `gorm:"size:255;not null" json:"image_path"`
    CreatedAt time.Time `json:"created_at"`
}