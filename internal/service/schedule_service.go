package service

import (
	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type ScheduleRepository interface {
	AddSchedule(schedule dto.CreateScheduleDTO) (string, utils.MessageJSON)
}

type ScheduleService struct{
	rep ScheduleRepository
}

func NewScheduleService(r ScheduleRepository) *ScheduleService {
	return &ScheduleService{rep: r}
}

func (s *ScheduleService) CreateSchedule(schedule dto.CreateScheduleDTO) (string, utils.MessageJSON){
	return s.rep.AddSchedule(schedule)
}