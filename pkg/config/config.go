package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost           string
	DBPort           string
	PostgresUser     string
	PostgresPassword string
	PostgresName     string
	JWTSecret        string
	Port             string
	LogLevel         string
}

var loadedConfig *Config

func Load() (*Config, error) {
	_ = godotenv.Load(".env")

	cfg := &Config{
		DBHost:           strings.TrimSpace(os.Getenv("DB_HOST")),
		DBPort:           strings.TrimSpace(os.Getenv("DB_PORT")),
		PostgresUser:     strings.TrimSpace(os.Getenv("DB_USER")),
		PostgresPassword: strings.TrimSpace(os.Getenv("DB_PASSWORD")),
		PostgresName:     strings.TrimSpace(os.Getenv("DB_NAME")),
		JWTSecret:        strings.TrimSpace(os.Getenv("JWT_SECRET")),
		Port:             strings.TrimSpace(os.Getenv("SERVER_PORT")),
		LogLevel:         strings.TrimSpace(os.Getenv("LOG_LEVEL")),
	}

	var errs []string

	required := []struct {
		key   string
		value string
	}{
		{key: "DB_HOST", value: cfg.DBHost},
		{key: "DB_PORT", value: cfg.DBPort},
		{key: "DB_USER", value: cfg.PostgresUser},
		{key: "DB_PASSWORD", value: cfg.PostgresPassword},
		{key: "DB_NAME", value: cfg.PostgresName},
		{key: "JWT_SECRET", value: cfg.JWTSecret},
		{key: "SERVER_PORT", value: cfg.Port},
		{key: "LOG_LEVEL", value: cfg.LogLevel},
	}

	for _, field := range required {
		if field.value == "" {
			errs = append(errs, fmt.Sprintf("%s is required", field.key))
		}
	}

	if cfg.DBPort != "" {
		if _, err := strconv.Atoi(cfg.DBPort); err != nil {
			errs = append(errs, "DB_PORT must be a valid integer")
		}
	}

	if cfg.Port != "" {
		if _, err := strconv.Atoi(cfg.Port); err != nil {
			errs = append(errs, "PORT must be a valid integer")
		}
	}

	if len(errs) > 0 {
		return nil, fmt.Errorf("invalid configuration: %s", strings.Join(errs, "; "))
	}

	loadedConfig = cfg
	return loadedConfig, nil
}

func MustGet() *Config {
	if loadedConfig == nil {
		cfg, err := Load()
		if err != nil {
			panic(err)
		}
		loadedConfig = cfg
	}

	return loadedConfig
}
