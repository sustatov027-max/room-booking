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

func (r *SlotsRepository) GetFilteredSlots(room_id string, date time.Time) ([]models.Slot, utils.MessageJSON) {
	var (
		rows *sql.Rows
		err  error
	)

	if room_id == "" {
		query := `
        SELECT id, room_id, start_time, end_time, created_at
        FROM slots
        WHERE start_time >= $1
          AND start_time < $1 + interval '1 day'
          AND start_time > NOW()
        ORDER BY start_time ASC
        `
		rows, err = r.DB.Query(query, date)
	} else {
		query := `
        SELECT id, room_id, start_time, end_time, created_at
        FROM slots
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

	var slots []models.Slot
	for rows.Next() {
		var slot models.Slot
		err := rows.Scan(
			&slot.ID,
			&slot.RoomID,
			&slot.StartAt,
			&slot.EndAt,
			&slot.CreatedAt,
		)
		if err != nil {
			return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
		}
		slots = append(slots, slot)
	}

	return slots, utils.MessageJSON{}
}
