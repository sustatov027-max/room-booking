package models

import "github.com/google/uuid"

type AuthUser struct {
	ID           uuid.UUID
	PasswordHash string
	Role         string
}
