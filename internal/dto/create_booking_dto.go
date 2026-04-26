package dto

type CreateBookingDTO struct {
	SlotID         string `json:"slot_id" binding:"required,uuid"`
	UserID         string `json:"user_id"`
	ConferenceLink string `json:"conference_link"`
}
