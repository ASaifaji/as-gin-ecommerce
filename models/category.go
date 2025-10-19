package models

import "time"

// category model
type Category struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    Name      string    `gorm:"uniqueIndex;size:100;not null" json:"name"`
    Slug      string    `gorm:"uniqueIndex;size:100;not null" json:"slug"`
    Products  []Product `gorm:"constraint:OnDelete:SET NULL;" json:"products"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    ProductCount int64 `gorm:"column:product_count" json:"product_count"`
}
