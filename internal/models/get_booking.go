package models

import "time"

type GetBooking struct {
	ID             string    `json:"id"`
	StartAt        string    `json:"start_at"`
	EndAt          string    `json:"end_at"`
	RoomName       string    `json:"room_name"`
	Status         string    `json:"status"`
	ConferenceLink string    `json:"conference_link"`
	CreatedAt      time.Time `json:"created_at"`
}
