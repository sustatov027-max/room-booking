package service

import (
	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type RoomRepository interface {
	ListRooms() ([]models.Room, utils.MessageJSON)
	AddRoom(dto.CreateRoomDTO) (string, utils.MessageJSON)
}

type RoomService struct {
	rep RoomRepository
}

func NewRoomService(r RoomRepository) *RoomService {
	return &RoomService{rep: r}
}

func (s *RoomService) ListRooms() ([]models.Room, utils.MessageJSON) {
	return s.rep.ListRooms()
}

func (s *RoomService) CreateRoom(room dto.CreateRoomDTO) (string, utils.MessageJSON){
	return s.rep.AddRoom(room)
}
