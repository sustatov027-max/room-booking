package service

import (
	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type BookingRepository interface {
	AddBooking(dto.CreateBookingDTO) (string, utils.MessageJSON)
	GetBookingByUserID(string) ([]models.Booking, utils.MessageJSON)
}

type BookingService struct {
	rep BookingRepository
}

func NewBookingService(r BookingRepository) *BookingService {
	return &BookingService{rep: r}
}

func (s *BookingService) CreateBooking(booking dto.CreateBookingDTO) (string, utils.MessageJSON) {
	return s.rep.AddBooking(booking)
}

func (s *BookingService) GetBookings(uuid string) ([]models.Booking, utils.MessageJSON){
	return s.rep.GetBookingByUserID(uuid)
}
