package models

import ()

// input product 
type ProductInput struct{
	Name          string  `json:"name" binding:"required,min=5,max=255"`
	Description   string  `json:"description" binding:"required,min=10"`
	Price         int64   `json:"price" binding:"required,gt=0"`
	StockQuantity int     `json:"stock_quantity" binding:"required"`
	CategoryID    uint    `json:"category_id"`
	IsActive      bool    `json:"is_active"`
}

type UpdateProductInput struct{
	Name 		  string  `json:"name,omitempty" binding:"min=5,max=255"`
	Description   string  `json:"description,omitempty" binding:"min=10"`
	Price 		  int64   `json:"price,omitempty" binding:"gt=0"`
	StockQuantity int     `json:"stock_quantity,omitempty"`
	CategoryID    uint    `json:"category_id,omitempty"`
	IsActive      bool    `json:"is_active,omitempty"`
}