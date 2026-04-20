package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/internal/middleware"
	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type RoomServ interface {
	ListRooms() ([]models.Room, utils.MessageJSON)
	CreateRoom(dto.CreateRoomDTO) (string, utils.MessageJSON)
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

	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware(), middleware.RequireRole("admin"))
	admin.POST("/rooms", h.CreateRoom)
}

func (h *RoomHandler) GetRooms(ctx *gin.Context) {
	rooms, message := h.serv.ListRooms()
	if message.Message != "" {
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	ctx.IndentedJSON(http.StatusOK, rooms)
}

func (h *RoomHandler) CreateRoom(ctx *gin.Context){
	var body dto.CreateRoomDTO

	err := ctx.ShouldBindBodyWithJSON(&body)
	if err != nil{
		ctx.IndentedJSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	uuid, message := h.serv.CreateRoom(body)
	if message.Message != ""{
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	ctx.IndentedJSON(http.StatusCreated, map[string]string{"uuid": uuid})
}
