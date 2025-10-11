package controllers

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

// Dapatkan User ID dari context (Diakses oleh semua controller di package ini)
func getIDFromContext(ctx *gin.Context) (uint, error) {
	userIDVal, exists := ctx.Get("id")
	if !exists {
		return 0, fmt.Errorf("user ID not found in context")
	}
	id, ok := userIDVal.(uint)
	if !ok {
		return 0, fmt.Errorf("invalid user ID type in context")
	}
	return id, nil
}
