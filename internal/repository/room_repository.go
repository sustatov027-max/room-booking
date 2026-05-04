package repository

import (
	"database/sql"
	"errors"
	"time"

	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type RoomRepository struct {
	DB *sql.DB
}

func (r *RoomRepository) ListRooms() ([]models.Room, utils.MessageJSON) {
	rows, err := r.DB.Query(`
		SELECT id, name, description, capacity, image, created_at
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
		if err = rows.Scan(&room.ID, &room.Name, &room.Description, &room.Capacity, &room.Image, &room.CreatedAt); err != nil {
			return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
		}
		rooms = append(rooms, room)
	}

	if err = rows.Err(); err != nil {
		return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	return rooms, utils.MessageJSON{}
}

func (r *RoomRepository) AddRoom(room dto.CreateRoomDTO) (string, utils.MessageJSON) {
	var UUID string

	createdAt := time.Now().UTC()

	err := r.DB.QueryRow(`
				INSERT INTO rooms(name, description, capacity, image, created_at) 
				VALUES ($1, $2, $3, $4, $5)
				RETURNING id;`,
		room.Name, room.Description, room.Capacity, room.Image, createdAt,
	).Scan(&UUID)

	if err != nil {
		return "", utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	return UUID, utils.MessageJSON{}
}

func (r *RoomRepository) DeleteRoomByID(roomID string) utils.MessageJSON {
	result, err := r.DB.Exec(`
		DELETE FROM rooms
		WHERE id = $1;
	`, roomID)
	if err != nil {
		return utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return utils.MessageJSON{Code: 500, Message: err.Error()}
	}
	if rowsAffected == 0 {
		return utils.MessageJSON{Code: 404, Message: errors.New("room not found").Error()}
	}

	return utils.MessageJSON{}
}
