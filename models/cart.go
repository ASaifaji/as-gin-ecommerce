package models

import "time"

// carts (keranjang utama) model
type Cart struct {
    ID        uint       `gorm:"primaryKey" json:"id"`
    UserID    uint       `gorm:"uniqueIndex" json:"user_id"`
    User      *User       `json:"user"`
    Items     []CartItem `gorm:"constraint:OnDelete:CASCADE;" json:"items"`
    CreatedAt time.Time  `json:"created_at"`
    UpdatedAt time.Time  `json:"updated_at"`
}

type CartItem struct {
    ID        uint    `gorm:"primaryKey" json:"id"`
    CartID    uint    `gorm:"index;not null" json:"cart_id"`
    Cart      Cart    `json:"cart"`
    ProductID uint    `gorm:"not null" json:"product_id"`
    Product   Product `json:"product"`
    Quantity  int     `gorm:"not null" json:"quantity"`
    // Composite unique index: one product per cart
    UniqueKey string `gorm:"-" json:"-"` // not in DB, just placeholder for migration
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