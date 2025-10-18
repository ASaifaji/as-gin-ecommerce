package models

import ()

// untuk input category
type CategoryInput struct {
	Name string `json:"name" binding:"required,min=2,max=100"`
	Slug string `json:"slug,omitempty" binding:"min=2,max=255"`
}

type UpdateCategoryInput struct {
    Name        string `json:"name,omitempty" binding:"min=2,max=255"`
	Slug		string `json:"slug,omitempty" binding:"min=2,max=255"`
}