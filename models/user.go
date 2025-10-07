package models

import "time"

// User model
type User struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    Username  string    `gorm:"uniqueIndex;size:100;not null" json:"username"`
    Email     string    `gorm:"uniqueIndex;size:100;not null" json:"email"`
    Password  string    `json:"-"`
    Admin     bool      `gorm:"default:false" json:"admin"`
    Provider  string    `gorm:"size:50;default:local" json:"provider"`

    Addresses []Address `gorm:"constraint:OnDelete:CASCADE;" json:"addresses"`

    Orders    []Order   `json:"orders"`
    Cart      Cart      `json:"cart"`

    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}