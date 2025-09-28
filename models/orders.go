package models

import "time"

// model untuk order
type Order struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	UserID       uint      `gorm:"not null" json:"user_id"`
	Total        float64   `gorm:"type:decimal(10,2);not null" json:"total"`
	Status       string    `gorm:"size:50;default:'Menunggu Pembayaran'" json:"status"` 
	AddressText  string    `gorm:"type:text;not null" json:"address_text"`
	CreatedAt    time.Time
	UpdatedAt    time.Time

	// relasi
	User         User     
	OrderItems   []OrderItem 
}

// untuk update status order
type UpdateOrderStatusInput struct{
	Status string `jso:"status" binding:"required,oneof='Menunggu Pembayaran' 'Diproses' 'Dikirim' 'Selesai' 'Dibatalkan'"` 
}