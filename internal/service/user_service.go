package service

import (
	"github.com/sustatov027-max/room-booking/internal/dto"
)

type UserRepository interface {
	AddUser(user dto.RegisterUserDTO) (string, error)
}

type UserService struct {
	rep UserRepository
}

func NewUserService(r UserRepository) *UserService {
	return &UserService{rep: r}
}

func (s *UserService) RegisterUser(user dto.RegisterUserDTO) (string, error){
	return s.rep.AddUser(user)
}
