package repository

import (
	"database/sql"
	"time"

	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type SlotsRepository struct {
	DB *sql.DB
}

func (r *SlotsRepository) GetFilteredSlots(room_id string, date time.Time) ([]models.GetSlot, utils.MessageJSON) {
	var (
		rows *sql.Rows
		err  error
	)

	if room_id == "" {
		query := `
        SELECT s.id, s.room_id, s.start_time, s.end_time, s.created_at,
       	CASE WHEN b.id IS NOT NULL THEN 'booked' ELSE 'free' END AS status
		FROM slots s
		LEFT JOIN bookings b ON b.slot_id = s.id AND b.status = 'active'
        WHERE start_time >= $1
          AND start_time < $1 + interval '1 day'
          AND start_time > NOW()
        ORDER BY start_time ASC
        `
		rows, err = r.DB.Query(query, date)
	} else {
		query := `
        SELECT s.id, s.room_id, s.start_time, s.end_time, s.created_at,
       	CASE WHEN b.id IS NOT NULL THEN 'booked' ELSE 'free' END AS status
		FROM slots s
		LEFT JOIN bookings b ON b.slot_id = s.id AND b.status = 'active'
        WHERE room_id = $1
          AND start_time >= $2
          AND start_time < $2 + interval '1 day'
          AND start_time > NOW()
        ORDER BY start_time ASC
        `
		rows, err = r.DB.Query(query, room_id, date)
	}

	if err != nil {
		return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
	}
	defer rows.Close()

	var slots []models.GetSlot
	for rows.Next() {
		var slot models.GetSlot
		err := rows.Scan(
			&slot.ID,
			&slot.RoomID,
			&slot.StartAt,
			&slot.EndAt,
			&slot.CreatedAt,
			&slot.Status,
		)
		if err != nil {
			return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
		}
		slots = append(slots, slot)
	}

	return slots, utils.MessageJSON{}
}
