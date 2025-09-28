package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
    "golang.org/x/oauth2"
    "golang.org/x/oauth2/google"
)

type Config struct {
    AppPort   string
    DBUser    string
    DBPass    string
    DBHost    string
    DBPort    string
    DBName    string
}

var AppConfig *Config

var GoogleOAuthConfig *oauth2.Config

func LoadConfig() {
    // Load .env file if present
    err := godotenv.Load()
    if err != nil {
        log.Println("No .env file found, using system environment")
    }

    AppConfig = &Config{
        AppPort:   getEnv("APP_PORT", "8080"),
        DBUser:    getEnv("DB_USER", "root"),
        DBPass:    getEnv("DB_PASS", ""),
        DBHost:    getEnv("DB_HOST", "127.0.0.1"),
        DBPort:    getEnv("DB_PORT", "3306"),
        DBName:    getEnv("DB_NAME", "mydb"),
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