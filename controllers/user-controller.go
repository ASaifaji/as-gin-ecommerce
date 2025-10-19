package controllers

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/ASaifaji/as-gin-ecommerce/database"
	"github.com/ASaifaji/as-gin-ecommerce/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetAllUsers(ctx *gin.Context) {
	var users []models.User

	if err := database.DB.Preload("Cart").Find(&users).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch users",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

func GetUserDetail(ctx *gin.Context) {
	idParam := ctx.Param("id")

	var user models.User

	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"errror": "Invalid user ID format"})
		return
	}

	if err := database.DB.Preload("Addresses").Preload("Orders").Preload("Cart").First(&user, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Do not return password in response
	ctx.JSON(http.StatusOK, user)
}

func GetProfile(ctx *gin.Context) {
    userID, err := getIDFromContext(ctx) 
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }

    var user models.User
    if err := database.DB.Preload("Addresses").Preload("Orders").Preload("Cart").First(&user, userID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

    ctx.JSON(http.StatusOK, gin.H{
        "user": user, 
    })
}

func DeleteUser(ctx *gin.Context) {
	// Get the :id parameter from URL
	idParam := ctx.Param("id")

	// Convert to uint
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid user ID",
		})
		return
	}

	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	// Prevent deleting root admin (optional safety)
	if user.Admin {
		ctx.JSON(http.StatusForbidden, gin.H{
			"error": "Cannot delete admin account",
		})
		return
	}

	if err := database.DB.Delete(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete user",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
	})
}

func UpdateProfile(ctx *gin.Context) {
	userID, err := getIDFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input models.UpdateProfileInput 
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var address models.Address
	if err := database.DB.Where("user_id = ?", userID).First(&address).Error; err != nil {
		// Jika alamat tidak ditemukan, buat alamat baru jika ada data address di input
		newAddress := models.Address{
			UserID:  uint(userID),
			Street:  input.Street,
			City:    input.City,
			Province: input.Province,
			Postal:  input.Postal,
			Country: input.Country,
		}
		database.DB.Create(&newAddress)
	} else {
		// Jika alamat ditemukan, update alamat jika ada data address di input
		
		address.Street = input.Street
		address.City = input.City
		address.Province = input.Province
		address.Postal = input.Postal
		address.Country = input.Country
		database.DB.Save(&address)
	}

	// Update field yang diperbolehkan
	if input.Username != "" {
		user.Username = input.Username
	}
	if input.Email != "" {
		user.Email = input.Email
	}
	if input.Phone != "" {
		user.Phone = input.Phone
	}
	if err := database.DB.Save(&user).Error; err != nil {
    	ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
    	return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Profile updated successfully",
		"user": user,
	})
}

func UpdateUser(ctx *gin.Context) {
    id := ctx.Param("id")
    userID, err := strconv.ParseUint(id, 10, 64)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
        return
    }

    var input models.UpdateUserAdminInput 
    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user models.User
    if err := database.DB.First(&user, userID).Error; err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    if input.Username != "" {
        user.Username = input.Username
    }
    if input.Email != "" {
        user.Email = input.Email
    }

    database.DB.Save(&user)

    ctx.JSON(http.StatusOK, gin.H{"message": "User updated successfully (Admin)", "user": user})
}

func UploadAvatar(ctx *gin.Context) {
    userID, err := getIDFromContext(ctx)
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }

    var user models.User
    if err := database.DB.First(&user, userID).Error; err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    file, err := ctx.FormFile("avatar")
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded: " + err.Error()})
        return
    }

    oldAvatarPath := user.AvatarPath

    extension := filepath.Ext(file.Filename)
    uniqueFilename := uuid.New().String() + extension
    newAvatarPath := filepath.Join("uploads", "avatars", uniqueFilename)

    if err := ctx.SaveUploadedFile(file, newAvatarPath); err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
        return
    }

    if err := database.DB.Model(&user).Update("avatar_path", newAvatarPath).Error; err != nil {
        os.Remove(newAvatarPath)
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile avatar"})
        return
    }

    if oldAvatarPath != "" {
        if err := os.Remove(oldAvatarPath); err != nil {
            log.Printf("Warning: Failed to delete old avatar file %s: %v\n", oldAvatarPath, err)
        }
    }

    ctx.JSON(http.StatusOK, gin.H{
        "message":     "Avatar updated successfully",
        "avatar_path": newAvatarPath,
    })
}


func DeleteAvatar(ctx *gin.Context) {
    userID, err := getIDFromContext(ctx)
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }

    var user models.User
    if err := database.DB.First(&user, userID).Error; err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    if user.AvatarPath == "" {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "User does not have an avatar"})
        return
    }

    avatarPathToDelete := user.AvatarPath

    // Hapus path dari database (set ke string kosong)
    if err := database.DB.Model(&user).Update("avatar_path", "").Error; err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove avatar from profile"})
        return
    }

    // Hapus file fisik dari storage
    if err := os.Remove(avatarPathToDelete); err != nil {
        log.Printf("Warning: Failed to delete avatar file %s: %v\n", avatarPathToDelete, err)
    }

    ctx.JSON(http.StatusOK, gin.H{"message": "Avatar deleted successfully"})
}