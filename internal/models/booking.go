package models

import "time"

type Booking struct {
	ID             string    `json:"id"`
	SlotID         string    `json:"slot_id" binding:"required,uuid"`
	UserID         string    `json:"user_id" binding:"required,uuid"`
	Status         string    `json:"status" binding:"required,oneof=active cancelled"`
	ConferenceLink string    `json:"conference_link"`
	CreatedAt      time.Time `json:"created_at"`
}
