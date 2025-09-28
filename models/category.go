package models

import "time"

// category model
type Category struct {
	ID        uint      `gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"uniqueIndex;size:100;not null"` 
	CreatedAt time.Time
	UpdatedAt time.Time

	// relasi
	Products  []Product
}

// untuk input category
type CategoryInput struct {
	Name string `json:"name" binding:"required,min=3,max=100"`
}
