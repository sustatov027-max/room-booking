package dto

import (
	"fmt"
	"time"
)

type CreateScheduleDTO struct {
	RoomID     string `json:"room_id" binding:"required"`
	DaysOfWeek []int  `json:"days_of_week" binding:"required,min=1,dive,min=0,max=6"`
	StartTime  string `json:"start_time" binding:"required"`
	EndTime    string `json:"end_time" binding:"required"`
}

func (d *CreateScheduleDTO) GetStartAndEndTime() (time.Time, time.Time, error) {
	startTime, err := time.Parse("15:04:05", d.StartTime)
	if err != nil {
		return time.Time{}, time.Time{}, fmt.Errorf("invalid start_time format: %w", err)
	}

	endTime, err := time.Parse("15:04:05", d.EndTime)
	if err != nil {
		return time.Time{}, time.Time{}, fmt.Errorf("invalid end_time format: %w", err)
	}

	if d.StartTime >= d.EndTime {
		return time.Time{}, time.Time{}, fmt.Errorf("start_time must be less than end_time")
	}

	return startTime, endTime, nil
}
