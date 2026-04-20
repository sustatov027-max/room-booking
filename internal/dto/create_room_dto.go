package dto

type CreateRoomDTO struct{
	Name string `json:"name" binding:"required,min=2"`
	Description string `json:"decription"`
	Capacity int `json:"capacity" binding:"required,numeric,gte=1"`
}