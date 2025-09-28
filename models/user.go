package models

import "time"

// User model
type User struct {
    ID        uint      `gorm:"primaryKey"`
    Username  string    `gorm:"uniqueIndex;size:100;not null"`
    Email     string    `gorm:"uniqueIndex;size:100;not null"`
    Password  string    `gorm:""` // stored hashed password empty if google oauth
    Admin     bool      `gorm:"default:false"`
    Provider  string    `gorm:"size:50;default:local"` // local or google
    CreatedAt time.Time
    UpdatedAt time.Time
}

type RegisInput struct {
    Username string `form:"username" json:"username" binding:"required,min=3,max=32"`
    Email    string `form:"email"    json:"email"    binding:"required,email"`
    Password string `form:"password" json:"password" binding:"required,min=6"`
}

type LoginInput struct {
    Login string `form:"login" json:"login" binding:"required,min=3,max=32"`
    Password string `form:"password" json:"password" binding:"required,min=6"`
}

type LoginInputEmail struct {
    Email    string `form:"email"    json:"email"    binding:"required,email"`
    Password string `form:"password" json:"password" binding:"required,min=6"`
}

type SetPasswordInput struct {
    Email           string `json:"email" binding:"required,email"`
    OldPassword     string `json:"old_password" binding:"required,min=6"`
    NewPassword     string `json:"new_password" binding:"required,min=6"`
}