package models

import ()

// untuk input category
type CategoryInput struct {
	Name string `json:"name" binding:"required,min=3,max=100"`
}

type UpdateCategoryInput struct {
    Name        string `json:"name,omitempty" binding:"min=3,max=255"`
}