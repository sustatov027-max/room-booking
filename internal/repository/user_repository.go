package repository

import (
	"database/sql"
	"log"

	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type UserRepository struct {
	DB *sql.DB
}

func (r UserRepository) AddUser(user dto.RegisterUserDTO) (string, error) {
	log.Printf("[REPO] Starting AddUser for email: %s", user.Email)

	passwordHash, err := utils.HashPassword(user.Password)
	if err != nil {
		log.Printf("[REPO] Hash error: %v", err)
		return "", err
	}
	log.Printf("[REPO] Password hashed successfully")

	var UUID string
	log.Printf("[REPO] Executing query: INSERT INTO users...")

	err = r.DB.QueryRow(`
		INSERT INTO users (email, password_hash, role) 
		VALUES ($1, $2, $3) 
		RETURNING id;`,
		user.Email, passwordHash, user.Role,
	).Scan(&UUID)

	if err != nil {
		log.Printf("[REPO] Database error: %v", err)
		return "", err
	}

	log.Printf("[REPO] User created with UUID: %s", UUID)
	return UUID, nil
}
