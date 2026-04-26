package models

import "time"

type Slot struct {
	ID        string    `json:"id"`
	RoomID    string    `json:"room_id"`
	StartAt   time.Time `json:"start_at"`
	EndAt     time.Time `json:"end_at"`
	CreatedAt time.Time `json:"created_at"`
}
