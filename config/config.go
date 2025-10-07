package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
    "golang.org/x/oauth2"
    "golang.org/x/oauth2/google"
)

type appConfig struct {
    AppPort     string
    DBUser      string
    DBPass      string
    DBHost      string
    DBPort      string
    DBName      string
}

type adminConfig struct{
    AdminUser   string
    AdminEmail  string
    AdminPass   string
}

var AdminConfig *adminConfig

var AppConfig *appConfig

var GoogleOAuthConfig *oauth2.Config

func LoadConfig() {
    // Load .env file if present
    err := godotenv.Load()
    if err != nil {
        log.Println("No .env file found, using system environment")
    }

    AppConfig = &appConfig{
        AppPort:    getEnv("APP_PORT", "8080"),
        DBUser:     getEnv("DB_USER", "root"),
        DBPass:     getEnv("DB_PASS", ""),
        DBHost:     getEnv("DB_HOST", "127.0.0.1"),
        DBPort:     getEnv("DB_PORT", "3306"),
        DBName:     getEnv("DB_NAME", "mydb"),
    }

    AdminConfig = &adminConfig{
        AdminUser:  getEnv("ADMIN_USER", "root"),
        AdminEmail: getEnv("ADMIN_EMAIL", "admin@example.com"),
        AdminPass:  getEnv("ADMIN_PASS", "abcd1234"),
    }

    GoogleOAuthConfig = &oauth2.Config{
        RedirectURL:    "http://localhost:8080/api/auth/google/callback",
        ClientID:       getEnv("GoogleOAuthClientID", ""),
        ClientSecret:   getEnv("GoogleOAuthClientSecret", ""),
        Scopes:         []string{"https://www.googleapis.com/auth/userinfo.email"},
        Endpoint:       google.Endpoint,
    }
}

func getEnv(key, fallback string) string {
    if value, exists := os.LookupEnv(key); exists {
        return value
    }
    return fallback
}