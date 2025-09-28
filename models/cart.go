package models

import "time"

// carts (keranjang utama) model
type Cart struct{
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"uniqueIndex;not null"` // foreign key ke user
	CreatedAt time.Time
	UpdatedAt time.Time

	// untuk relasi
	User      User  
	CartItems []CartItem
	
}