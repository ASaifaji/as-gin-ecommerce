package models

import "time"

// model untuk order items
type OrderItem struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	OrderID    uint      `json:"order_id" gorm:"not null"` 
	ProductID  uint      `json:"product_id" gorm:"not null"` 
	Price      float64   `json:"price" gorm:"type:decimal(10,2);not null"`
	Quantity   uint      `json:"quantity" gorm:"not null"` 
	Subtotal   float64   `json:"subtotal" gorm:"type:decimal(10,2);not null"` 
	CreatedAt  time.Time
	UpdatedAt  time.Time

	// relasi
	Order      Order     
	Product    Product   
}

