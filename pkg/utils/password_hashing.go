package utils

import (
	"log"
	"strconv"

	"github.com/sustatov027-max/room-booking/pkg/config"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	cost, err := strconv.Atoi(config.MustGet().Cost)
	log.Print("COST: ", cost)
	if err != nil{
		log.Fatal("Invalid cost")
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), cost)
	if err != nil {
		return "", err
	}

	return string(passwordHash), nil
}
