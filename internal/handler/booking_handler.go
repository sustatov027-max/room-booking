package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/internal/middleware"
	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type BookingServ interface {
	CreateBooking(dto.CreateBookingDTO) (string, utils.MessageJSON)
	GetBookings(string) ([]models.GetBooking, utils.MessageJSON)
	DeleteBooking(string, string) utils.MessageJSON
	GetAllBookings(int, int) (models.PaginationBookings, utils.MessageJSON)
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

	AdminBookings := r.Group("/admin")
	AdminBookings.Use(middleware.AuthMiddleware(), middleware.RequireRole("admin"))
	AdminBookings.GET("/bookings", h.GetAllBookings)
}

func (h *BookingHandler) CreateBooking(ctx *gin.Context) {
	var body dto.CreateBookingDTO

	err := ctx.ShouldBindBodyWithJSON(&body)
	if err != nil {
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var message utils.MessageJSON

	body.UserID, message = utils.GetUserID(ctx)
	if message.Message != "" {
		ctx.IndentedJSON(message.Code, gin.H{"error": message.Message})
		return
	}

	uuid, message := h.serv.CreateBooking(body)
	if message.Message != "" {
		ctx.IndentedJSON(message.Code, gin.H{"error": message.Message})
		return
	}

	ctx.IndentedJSON(http.StatusCreated, gin.H{"uuid": uuid})
}

func (h *BookingHandler) GetBookings(ctx *gin.Context) {
	uuid, message := utils.GetUserID(ctx)
	if message.Message != "" {
		ctx.IndentedJSON(message.Code, gin.H{"error": message.Message})
		return
	}

	bookings, message := h.serv.GetBookings(uuid)
	if message.Message != "" {
		ctx.IndentedJSON(message.Code, gin.H{"error": message.Message})
		return
	}

	ctx.IndentedJSON(http.StatusOK, bookings)
}

func (h *BookingHandler) DeleteBooking(ctx *gin.Context) {
	bookingID := ctx.Param("id")
	userID, message := utils.GetUserID(ctx)
	if message.Message != "" {
		ctx.IndentedJSON(message.Code, gin.H{"error": message.Message})
		return
	}

	message = h.serv.DeleteBooking(bookingID, userID)
	if message.Message != "" {
		ctx.IndentedJSON(message.Code, gin.H{"error": message.Message})
		return
	}

	ctx.Status(http.StatusNoContent)
}

func (h *BookingHandler) GetAllBookings(ctx *gin.Context) {
	pageStr := ctx.DefaultQuery("page", "1")
	limitStr := ctx.DefaultQuery("limit", "10")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Invalid page"})
	}
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Invalid limit"})
		return
	}

	offset := (page - 1) * limit

	paginationBookings, message := h.serv.GetAllBookings(limit, offset)
	if message.Message != "" {
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": message.Message})
		return
	}

	paginationBookings.Page = page

	ctx.IndentedJSON(http.StatusOK, paginationBookings)
}
