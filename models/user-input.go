package models

import ()

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
    NewPassword     string `json:"new_password" binding:"required,min=6"`
}

type UpdatePasswordInput struct {
    OldPassword     string `json:"old_password" binding:"required,min=6"`
    NewPassword     string `json:"new_password" binding:"required,min=6"`
}