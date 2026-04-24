package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/internal/middleware"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

func RegisterScheduleRoutes(r *gin.Engine, h *ScheduleHandler) {
	r.POST("/admin/schedules", middleware.AuthMiddleware(), middleware.RequireRole("admin"), h.CreateSchedule)
}

type ScheduleServ interface {
	CreateSchedule(schedule dto.CreateScheduleDTO) (string, utils.MessageJSON)
}

type ScheduleHandler struct {
	serv ScheduleServ
}

func NewScheduleHandler(s ScheduleServ) *ScheduleHandler {
	return &ScheduleHandler{serv: s}
}

func (h *ScheduleHandler) CreateSchedule(ctx *gin.Context) {
	var body dto.CreateScheduleDTO

	err := ctx.ShouldBindBodyWithJSON(&body)
	if err != nil {
		ctx.IndentedJSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	UUID, message := h.serv.CreateSchedule(body)
	if message.Message != ""{
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	ctx.IndentedJSON(http.StatusCreated, map[string]string{"uuid": UUID})
}
