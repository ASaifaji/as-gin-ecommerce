package models

import "time"

type Review struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    Rating    uint      `gorm:"not null;check:rating >= 1 AND rating <= 5" json:"rating"`
    Comment   string    `gorm:"type:text" json:"comment"`
    ProductID uint      `gorm:"not null;index" json:"product_id"`
    UserID    uint      `gorm:"not null;index" json:"user_id"`
    User      User		`json:"user"`

    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type ReviewInput struct {
	Rating  uint   `json:"rating" binding:"required,min=1,max=5"`
	Comment string `json:"comment"`
}