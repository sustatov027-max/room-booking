package models

type GetSlot struct {
	Slot
	RoomName string `json:"room_name"`
	Status   string `json:"status"`
}
