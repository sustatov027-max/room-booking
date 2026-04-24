package repository

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type UserRepository struct {
	DB *sql.DB
}

func (r *UserRepository) AddUser(user dto.RegisterUserDTO) (string, utils.MessageJSON) {
	var UUID string
	log.Printf("[REPO] Executing query: INSERT INTO users...")

	createdAt := time.Now().UTC()

	err := r.DB.QueryRow(`
		INSERT INTO users (email, password_hash, role, created_at)
		VALUES ($1, $2, $3, $4)
		RETURNING id;`,
		user.Email, user.Password, user.Role, createdAt,
	).Scan(&UUID)

	if err != nil {
		log.Printf("[REPO] Database error: %v", err)
		return "", utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	log.Printf("[REPO] User created with UUID: %s", UUID)
	return UUID, utils.MessageJSON{}
}

func (r *UserRepository) GetAuthUserByEmail(email string) (models.AuthUser, utils.MessageJSON) {
	var user models.AuthUser

	err := r.DB.QueryRow(`
		SELECT id, password_hash, role
		FROM users
		WHERE email = $1;`,
		email,
	).Scan(&user.ID, &user.PasswordHash, &user.Role)
	if err != nil {
		if err == sql.ErrNoRows {
			return models.AuthUser{}, utils.MessageJSON{Code: http.StatusUnauthorized, Message: "Invalid email or password"}
		}
		return models.AuthUser{}, utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	return user, utils.MessageJSON{}
}

func (r *UserRepository) GetAuthUserByUUID(uuid string) (models.User, utils.MessageJSON) {
	var user models.User
	user.Uuid = uuid

	err := r.DB.QueryRow(`
			SELECT email, role, created_at
			FROM users
			WHERE id = $1;`,
		uuid).Scan(&user.Email, &user.Role, &user.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return models.User{}, utils.MessageJSON{Code: http.StatusUnauthorized, Message: "Invalid email or password"}
		}
		return models.User{}, utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	return user, utils.MessageJSON{}
}
