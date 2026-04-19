package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sustatov027-max/room-booking/internal/middleware"
	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type RoomServ interface {
	ListRooms() ([]models.Room, utils.MessageJSON)
}

type RoomHandler struct {
	serv RoomServ
}

func NewRoomHandler(s RoomServ) *RoomHandler {
	return &RoomHandler{serv: s}
}

func RegisterRoomRoutes(r *gin.Engine, h *RoomHandler) {
	rooms := r.Group("/rooms")
	rooms.Use(middleware.AuthMiddleware(), middleware.RequireRole("user"))
	rooms.GET("", h.GetRooms)
}

func (h *RoomHandler) GetRooms(ctx *gin.Context) {
	rooms, message := h.serv.ListRooms()
	if message.Message != "" {
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	ctx.IndentedJSON(http.StatusOK, rooms)
}
