package models

import "time"

// model untuk cart_items 
type CartItem struct {
	ID        uint      `gorm:"primaryKey"`
	CartID    uint      `json:"cart_id" gorm:"not null"` // foreign key ke cart
	ProductID uint      `json:"product_id" gorm:"not null"` // foreign key ke product
	Quantity  uint      `json:"quantity" gorm:"not null;default:1"` 
	CreatedAt time.Time
	UpdatedAt time.Time

	// relasi
	Cart      Cart     
	Product   Product   
}

// menambahkan produk baru ke cart
type AddcartItemInput struct{
	ProductID uint `json:"product_id" binding:"required,gt=0"`
	Quantity uint `json:"quantity" binding:"required,gt=0"`
}

//  mengubah quantity produk yang sudah ada di cart
type UpdateCartItemQuantityInput struct{
	Quantity uint `json:"quantity" binding:"required,gt=0"`
}
