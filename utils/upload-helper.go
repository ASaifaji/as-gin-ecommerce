package utils

import (
	"errors"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func SaveUploadedFile(ctx *gin.Context) (string, error) {
    file, err := ctx.FormFile("image")
    if err != nil {
        if errors.Is(err, http.ErrMissingFile) {
            return "", nil
        }
        return "", err
    }

    // Generate a unique filename
    extension := filepath.Ext(file.Filename)
    uniqueFilename := uuid.New().String() + extension
    dst := filepath.Join("uploads", "products", uniqueFilename)

    // Save the file
    if err := ctx.SaveUploadedFile(file, dst); err != nil {
        return "", err
    }

    return dst, nil
}