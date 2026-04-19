package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"github.com/sustatov027-max/room-booking/pkg/config"
)

type Claims struct {
	UserID uuid.UUID `json:"user_id"`
	Role   string    `json:"role"`
	jwt.RegisteredClaims
}

func GetToken(userID uuid.UUID, role string) (string, error) {
	claims := &Claims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	jwtSecret := config.MustGet().Secret

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := []byte(jwtSecret)

	tokenString, err := token.SignedString(secret)
	if err != nil {
		return "", fmt.Errorf("Couldn't generate token")
	}

	return tokenString, nil
}
