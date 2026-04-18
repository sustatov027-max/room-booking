package repository

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/pkg/utils"
	"golang.org/x/crypto/bcrypt"
)

type UserRepository struct {
	DB *sql.DB
}

func (r *UserRepository) AddUser(user dto.RegisterUserDTO) (string, utils.MessageJSON) {
	var UUID string
	log.Printf("[REPO] Executing query: INSERT INTO users...")

	err := r.DB.QueryRow(`
		INSERT INTO users (email, password_hash, role) 
		VALUES ($1, $2, $3) 
		RETURNING id;`,
		user.Email, user.Password, user.Role,
	).Scan(&UUID)

	if err != nil {
		log.Printf("[REPO] Database error: %v", err)
		return "", utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	log.Printf("[REPO] User created with UUID: %s", UUID)
	return UUID, utils.MessageJSON{}
}

func (r *UserRepository) GetUser(user dto.LoginUserDTO) (string, utils.MessageJSON) {
	var userID uuid.UUID
	var hashedPassword string
	err := r.DB.QueryRow(`
		SELECT id, password_hash 
		FROM users 
		WHERE email = $1;`,
		user.Email).Scan(&userID, &hashedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", utils.MessageJSON{Code: http.StatusUnauthorized, Message: "Invalid email or password"}
		}
		return "", utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(user.Password))
	if err != nil {
		log.Print("Invalid password")
		return "", utils.MessageJSON{Code: http.StatusUnauthorized, Message: "Invalid email or password"}
	}

	token, err := utils.GetToken(userID)
	if err != nil {
		return "", utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	return token, utils.MessageJSON{}
}
