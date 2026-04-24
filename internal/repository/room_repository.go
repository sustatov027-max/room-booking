package repository

import (
	"database/sql"
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

func (r *RoomRepository) AddRoom(room dto.CreateRoomDTO) (string, utils.MessageJSON){
	var UUID string

	createdAt := time.Now().UTC()

	err := r.DB.QueryRow(`
				INSERT INTO rooms(name, description, capacity, created_at) 
				VALUES ($1, $2, $3, $4)
				RETURNING id;`,
			room.Name, room.Description, room.Capacity, createdAt,
		).Scan(&UUID)

	if err != nil{
		return "", utils.MessageJSON{Code:500, Message: err.Error()}
	}

	return UUID, utils.MessageJSON{}
}
