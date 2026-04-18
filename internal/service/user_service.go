package service

import (
	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type UserRepository interface {
	AddUser(user dto.RegisterUserDTO) (string, utils.MessageJSON)
	GetUser(user dto.LoginUserDTO) (string, utils.MessageJSON)
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
	return s.rep.GetUser(user)
}
