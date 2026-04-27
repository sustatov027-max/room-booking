package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/internal/middleware"
	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type BookingServ interface {
	CreateBooking(dto.CreateBookingDTO) (string, utils.MessageJSON)
	GetBookings(string) ([]models.GetBooking, utils.MessageJSON)
	DeleteBooking(string, string) (utils.MessageJSON)
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
	Bookings.GET("/my", h.GetBookings)
	Bookings.DELETE("/:id", h.DeleteBooking)
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

func (h *BookingHandler) GetBookings(ctx *gin.Context){
	uuid, message := utils.GetUserID(ctx)
	if message.Message != ""{
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	bookings, message := h.serv.GetBookings(uuid)
	if message.Message != ""{
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	ctx.IndentedJSON(http.StatusOK, bookings)
}

func (h *BookingHandler) DeleteBooking(ctx *gin.Context){
	bookingID := ctx.Param("id")
	userID, message := utils.GetUserID(ctx)
	if message.Message != ""{
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	message = h.serv.DeleteBooking(bookingID, userID)
	if message.Message != ""{
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	ctx.Status(http.StatusNoContent)
}