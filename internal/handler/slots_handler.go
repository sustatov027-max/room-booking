package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sustatov027-max/room-booking/internal/middleware"
	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

func RegisterSlotsRoutes(r *gin.Engine, h *SlotsHandler) {
	r.GET("/slots", middleware.AuthMiddleware(), h.GetSlots)
}

type SlotsServ interface {
	GetFilteredSlots(room_id string, date string) ([]models.GetSlot, utils.MessageJSON)
}

type SlotsHandler struct {
	serv SlotsServ
}

func NewSlotsHandler(s SlotsServ) *SlotsHandler {
	return &SlotsHandler{serv: s}
}

func (h *SlotsHandler) GetSlots(ctx *gin.Context) {
	room_id := ctx.DefaultQuery("room_id", "")
	date := ctx.DefaultQuery("date", time.Now().UTC().Format("2006-01-02"))

	slots, message := h.serv.GetFilteredSlots(room_id, date)
	if message.Message != "" {
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	ctx.IndentedJSON(http.StatusOK, slots)
}
