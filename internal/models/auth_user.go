package models

import "github.com/google/uuid"

type AuthUser struct {
	ID           uuid.UUID
	Name         string
	PasswordHash string
	Role         string
}
