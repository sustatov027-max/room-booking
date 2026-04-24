package main

import (
	"database/sql"
	"log"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/sustatov027-max/room-booking/internal/handler"
	"github.com/sustatov027-max/room-booking/internal/repository"
	"github.com/sustatov027-max/room-booking/internal/service"
	"github.com/sustatov027-max/room-booking/pkg/config"
	"github.com/sustatov027-max/room-booking/pkg/database"
)

func health(ctx *gin.Context) {
	if err := db.Ping(); err != nil {
		log.Fatal("Ошибка подключения:", err)
	}

	ctx.IndentedJSON(200, "status: Success connected DB")
}

var db *sql.DB
var cfg *config.Config

func main() {
	cfg = config.MustGet()
	if cfg != nil {
		log.Println("Configuration loaded")
	}

	db = database.DB()
	port := cfg.Port

	r := gin.Default()

	userRepository := &repository.UserRepository{DB: db}
	userService := service.NewUserService(userRepository)
	userHandler := handler.NewUserHandler(userService)

	roomRepository := &repository.RoomRepository{DB: db}
	roomService := service.NewRoomService(roomRepository)
	roomHandler := handler.NewRoomHandler(roomService)

	scheduleRepository := &repository.ScheduleRepository{DB: db}
	scheduleService := service.NewScheduleService(scheduleRepository)
	scheduleHandler := handler.NewScheduleHandler(scheduleService)

	handler.RegisterUserRoutes(r, userHandler)
	handler.RegisterRoomRoutes(r, roomHandler)
	handler.RegisterScheduleRoutes(r, scheduleHandler)
	r.GET("/health", health)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("server startup error: %v", err)
	}
}
