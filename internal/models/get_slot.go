package models

type GetSlot struct {
	Slot
	Status string `json:"status"`
}
