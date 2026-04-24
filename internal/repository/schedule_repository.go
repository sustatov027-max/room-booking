package repository

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/lib/pq"
	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type ScheduleRepository struct {
	DB *sql.DB
}

func (r *ScheduleRepository) AddSchedule(schedule dto.CreateScheduleDTO) (string, utils.MessageJSON) {
	tx, err := r.DB.Begin()
	if err != nil {
		return "", utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	startTime, endTime, err := schedule.GetStartAndEndTime()
	if err != nil {
		tx.Rollback()
		return "", utils.MessageJSON{Code: 400, Message: err.Error()}
	}

	var scheduleID string
	querySchedule := `
		INSERT INTO schedules (room_id, days_of_week, start_time, end_time)
		VALUES ($1, $2, $3, $4)
		RETURNING id;
		`

	err = tx.QueryRow(querySchedule, schedule.RoomID, pq.Array(schedule.DaysOfWeek),startTime, endTime).Scan(&scheduleID)
	if err != nil {
		tx.Rollback()
		return "", utils.MessageJSON{Code: 500, Message: fmt.Sprintf("Failed to create schedule: %v", err)}
	}

	var allSlots []models.Slot
    for _, dayOfWeek := range schedule.DaysOfWeek {
        slots := generateSlotsForCurrentWeek(schedule.RoomID, dayOfWeek, startTime, endTime)
        allSlots = append(allSlots, slots...)
    }

	querySlot := `
		INSERT INTO slots (room_id, start_time, end_time)
		VALUES ($1, $2, $3);
		`

	for _, slot := range allSlots {
        _, err = tx.Exec(querySlot, slot.RoomID, slot.StartAt, slot.EndAt)
        if err != nil {
            tx.Rollback()
            return "", utils.MessageJSON{Code: 500, Message: fmt.Sprintf("Failed to create slot: %v", err)}
        }
    }

	err = tx.Commit()
    if err != nil {
        return "", utils.MessageJSON{Code: 500, Message: err.Error()}
    }

	 return scheduleID, utils.MessageJSON{}
}
func generateSlotsForCurrentWeek(roomID string, dayOfWeek int, startTime, endTime time.Time) []models.Slot {
    var slots []models.Slot
    
    now := time.Now()
    targetDate := getDateForDayOfWeek(now, dayOfWeek)
    
    slotStart := time.Date(
        targetDate.Year(), targetDate.Month(), targetDate.Day(),
        startTime.Hour(), startTime.Minute(), startTime.Second(), 0,
        time.UTC,
    )
    
    slotEnd := time.Date(
        targetDate.Year(), targetDate.Month(), targetDate.Day(),
        endTime.Hour(), endTime.Minute(), endTime.Second(), 0,
        time.UTC,
    )
    
    current := slotStart
    for current.Before(slotEnd) {
        next := current.Add(30 * time.Minute)
        if next.After(slotEnd) {
            break
        }
        
        if current.After(time.Now()) {
            slots = append(slots, models.Slot{
                RoomID:  roomID,
                StartAt: current,
                EndAt:   next,
            })
        }
        
        current = next
    }
    
    return slots
}

// Получить дату для указанного дня недели на текущей неделе
func getDateForDayOfWeek(currentDate time.Time, targetDayOfWeek int) time.Time {
    currentWeekday := int(currentDate.Weekday())
    
    daysUntilTarget := targetDayOfWeek - currentWeekday
    if daysUntilTarget < 0 {
        daysUntilTarget += 7
    }
    
    return currentDate.AddDate(0, 0, daysUntilTarget)
}