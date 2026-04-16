package models

type User struct{
	Uuid string  `json:"uuid"`
	Email string `json:"email"`
	Password string `json:"password"`
	Role string `json:"role"`
	CreatedAt string `json:"created_at"`
}