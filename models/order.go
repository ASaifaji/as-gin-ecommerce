package models

import "time"

// model untuk order
// Enum-like constants
const (
    OrderPending   = "Menunggu Pembayaran"
    OrderProcessed = "Diproses"
    OrderShipped   = "Dikirim"
    OrderCompleted = "Selesai"
    OrderCanceled  = "Dibatalkan"
)

type Order struct {
    ID        uint        `gorm:"primaryKey" json:"id"`
    UserID    uint        `json:"user_id"`
    User      User        `json:"user"`
    Items     []OrderItem `gorm:"constraint:OnDelete:CASCADE;" json:"items"`
    Total     int64       `gorm:"not null" json:"total"`
    Status    string      `gorm:"size:50;default:'Menunggu Pembayaran'" json:"status"`
    CreatedAt time.Time   `json:"created_at"`
    UpdatedAt time.Time   `json:"updated_at"`
}

type OrderItem struct {
    ID        uint    `gorm:"primaryKey" json:"id"`
    OrderID   uint    `json:"order_id"`
    Order     Order   `json:"order"`
    ProductID uint    `json:"product_id"`
    Product   Product `json:"product"`
    Quantity  int     `gorm:"not null" json:"quantity"`
    Price     int64   `gorm:"not null" json:"price"` // per-item price snapshot
}