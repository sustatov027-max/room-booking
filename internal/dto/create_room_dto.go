package dto

type CreateRoomDTO struct {
	Name        string `json:"name" binding:"required,min=2"`
	Description string `json:"description"`
	Capacity    int    `json:"capacity" binding:"required,numeric,gte=1"`
	Image       string `json:"image"`
}
