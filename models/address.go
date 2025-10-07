package models

import "time"

type Address struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    UserID    uint      `gorm:"index;not null" json:"user_id"`
    User      User      `json:"user"`

    Label     string    `gorm:"size:50" json:"label"` // e.g. "Home", "Work"
    Street    string    `gorm:"size:255" json:"street"`
    City      string    `gorm:"size:100" json:"city"`
    Province  string    `gorm:"size:100" json:"province"`
    Postal    string    `gorm:"size:20" json:"postal"`
    Country   string    `gorm:"size:100" json:"country"`
    Phone     string    `gorm:"size:20" json:"phone"`

    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}