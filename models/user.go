package models

import "time"

// User model
type User struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Username string `gorm:"uniqueIndex;size:100;not null" json:"username"`
	Email    string `gorm:"uniqueIndex;size:100;not null" json:"email"`
	Phone     string    `gorm:"size:20" json:"phone"`
	Password string `json:"-"`
	Admin    bool   `gorm:"default:false" json:"admin"`
	Provider string `gorm:"size:50;default:local" json:"provider"`

	Addresses []Address `gorm:"constraint:OnDelete:CASCADE;" json:"addresses"`

	Orders []Order `json:"orders"`
	Cart   Cart    `json:"cart"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

//struct input untuk controller
// UpdateProfileInput digunakan untuk menerima data saat user mengupdate profilnya sendiri
type UpdateProfileInput struct {
  Username string `json:"username,omitempty"`
  Email    string `json:"email,omitempty"`
  Phone    string `json:"phone,omitempty"`
  Street   string `json:"street,omitempty"`
  City     string `json:"city,omitempty"`
  Province string `json:"province,omitempty"`
  Postal   string `json:"postal,omitempty"`
  Country  string `json:"country,omitempty"`
}


// UpdateUserAdminInput digunakan untuk menerima data saat Admin mengupdate user lain
type UpdateUserAdminInput struct {
	Username string `json:"username,omitempty"`
	Email    string `json:"email,omitempty"`
	Admin    *bool  `json:"admin,omitempty"`
}
