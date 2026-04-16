package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sustatov027-max/room-booking/internal/dto"
)

func RegisterUserRoutes(r *gin.Engine, h *UserHandler){
	r.POST("/auth/register", h.RegisterUser)
}

type UserServ interface{
	RegisterUser(dto.RegisterUserDTO) (string, error)
	//LoginUser(dto.LoginUserDTO) (string, error)
	//GetUser(userID int) (models.User, error)
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

	UUID, err := h.serv.RegisterUser(body)
	if err != nil{
		ctx.IndentedJSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	ctx.IndentedJSON(http.StatusCreated, map[string]string{"uuid": UUID})
}