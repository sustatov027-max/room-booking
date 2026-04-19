package service

import (
	"net/http"

	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
	"golang.org/x/crypto/bcrypt"
)

type UserRepository interface {
	AddUser(user dto.RegisterUserDTO) (string, utils.MessageJSON)
	GetAuthUserByEmail(email string) (models.AuthUser, utils.MessageJSON)
}

type UserService struct {
	rep UserRepository
}

func NewUserService(r UserRepository) *UserService {
	return &UserService{rep: r}
}

func (s *UserService) RegisterUser(user dto.RegisterUserDTO) (string, utils.MessageJSON) {
	var err error
	user.Password, err = utils.HashPassword(user.Password)
	if err != nil {
		return "", utils.MessageJSON{Code: 500, Message: err.Error()}
	}
	return s.rep.AddUser(user)
}

func (s *UserService) LoginUser(user dto.LoginUserDTO) (string, utils.MessageJSON) {
	authUser, message := s.rep.GetAuthUserByEmail(user.Email)
	if message.Message != "" {
		return "", message
	}

	err := bcrypt.CompareHashAndPassword([]byte(authUser.PasswordHash), []byte(user.Password))
	if err != nil {
		return "", utils.MessageJSON{Code: http.StatusUnauthorized, Message: "Invalid email or password"}
	}

	token, err := utils.GetToken(authUser.ID, authUser.Role)
	if err != nil {
		return "", utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	return token, utils.MessageJSON{}
}
