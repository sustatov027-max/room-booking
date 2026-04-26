package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/internal/middleware"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type BookingServ interface {
	CreateBooking(dto.CreateBookingDTO) (string, utils.MessageJSON)
}

type BookingHandler struct {
	serv BookingServ
}

func NewBookingHandler(s BookingServ) *BookingHandler {
	return &BookingHandler{serv: s}
}

func RegisterBookingRoutes(r *gin.Engine, h *BookingHandler) {
	Bookings := r.Group("/bookings")
	Bookings.Use(middleware.AuthMiddleware(), middleware.RequireRole("user"))
	Bookings.POST("", h.CreateBooking)
}

func (h *BookingHandler) CreateBooking(ctx *gin.Context) {
	var body dto.CreateBookingDTO

	err := ctx.ShouldBindBodyWithJSON(&body)
	if err != nil {
		ctx.IndentedJSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	var message utils.MessageJSON

	body.UserID, message = utils.GetUserID(ctx)
	if message.Message != ""{
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	uuid, message := h.serv.CreateBooking(body)
	if message.Message != ""{
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	ctx.IndentedJSON(http.StatusCreated, map[string]string{"uuid": uuid})
}
