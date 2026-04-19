package repository

import (
	"database/sql"

	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type RoomRepository struct {
	DB *sql.DB
}

func (r *RoomRepository) ListRooms() ([]models.Room, utils.MessageJSON) {
	rows, err := r.DB.Query(`
		SELECT id, name, description, capacity, created_at
		FROM rooms
		ORDER BY name;
	`)
	if err != nil {
		return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
	}
	defer rows.Close()

	rooms := make([]models.Room, 0)
	for rows.Next() {
		var room models.Room
		if err = rows.Scan(&room.ID, &room.Name, &room.Description, &room.Capacity, &room.CreatedAt); err != nil {
			return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
		}
		rooms = append(rooms, room)
	}

	if err = rows.Err(); err != nil {
		return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	return rooms, utils.MessageJSON{}
}
