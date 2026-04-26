package service

import (
	"time"

	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type SlotsRepository interface {
	GetFilteredSlots(room_id string, date time.Time) ([]models.GetSlot, utils.MessageJSON)
}

type SlotsService struct {
	rep SlotsRepository
}

func NewSlotsService(r SlotsRepository) *SlotsService {
	return &SlotsService{rep: r}
}

func (s *SlotsService) GetFilteredSlots(room_id string, date string) ([]models.GetSlot, utils.MessageJSON) {
	parsedDate, err := time.Parse("2006-01-02", date)
	if err != nil {
		return []models.GetSlot{}, utils.MessageJSON{
			Code:    400,
			Message: "Invalid date format, use YYYY-MM-DD",
		}
	}

	return s.rep.GetFilteredSlots(room_id, parsedDate)
}
