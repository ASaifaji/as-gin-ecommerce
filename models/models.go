package models

import "time"

// User model
type User struct {
    ID        uint      `gorm:"primaryKey"`
    Username  string    `gorm:"uniqueIndex;size:100;not null"`
    Email     string    `gorm:"uniqueIndex;size:100;not null"`
    Password  string    `gorm:"not null"` // stored hashed password
    Role      string    `gorm:"default:'customer'"`
    CreatedAt time.Time
    UpdatedAt time.Time
}

type UserInput struct {
    Username string `form:"username" json:"username" binding:"required,min=3,max=32"`
    Email    string `form:"email"    json:"email"    binding:"required,email"`
    Password string `form:"password" json:"password" binding:"required,min=6"`
}