package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/internal/middleware"
	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

func RegisterUserRoutes(r *gin.Engine, h *UserHandler){
	r.POST("/auth/register", h.RegisterUser)
	r.POST("/auth/login", h.LoginUser)
	r.GET("/auth/me", middleware.AuthMiddleware(), h.GetUser)
}

type UserServ interface{
	RegisterUser(dto.RegisterUserDTO) (string, utils.MessageJSON)
	LoginUser(dto.LoginUserDTO) (string, utils.MessageJSON)
	GetUser(userID string) (models.User, utils.MessageJSON)
}

type UserHandler struct{
	serv UserServ
}

func NewUserHandler(s UserServ) *UserHandler{
	return &UserHandler{serv: s}
}

func (h *UserHandler) RegisterUser(ctx *gin.Context){
	var body dto.RegisterUserDTO

	err := ctx.ShouldBindBodyWithJSON(&body)
	if err != nil{
		ctx.IndentedJSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	UUID, message := h.serv.RegisterUser(body)
	if message.Message != ""{
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	ctx.IndentedJSON(http.StatusCreated, map[string]string{"uuid": UUID})
}

func (h *UserHandler) LoginUser(ctx *gin.Context){
	var body dto.LoginUserDTO

	err := ctx.ShouldBindBodyWithJSON(&body)
	if err != nil{
		ctx.IndentedJSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	token, message := h.serv.LoginUser(body)
	if message.Message != ""{
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	ctx.IndentedJSON(http.StatusOK, map[string]string{"token":token})
}

func (h *UserHandler) GetUser(ctx *gin.Context){
	uuid, message := utils.GetUserID(ctx)
	if message.Message != ""{
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	user, message := h.serv.GetUser(uuid)
	if message.Message != ""{
		ctx.IndentedJSON(message.Code, map[string]string{"error": message.Message})
		return
	}

	ctx.IndentedJSON(200, user)
}