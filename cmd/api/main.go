package main

import (
	"database/sql"
	"log"

	"github.com/sustatov027-max/room-booking/pkg/config"
	"github.com/sustatov027-max/room-booking/pkg/database"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func health (ctx *gin.Context){
	if err := db.Ping(); err != nil {
        log.Fatal("Ошибка подключения:", err)
    }
	
	ctx.IndentedJSON(200, "status: Success connected DB")
}

var db *sql.DB
var cfg *config.Config

func main() {
	cfg = config.MustGet()
	if cfg != nil{
		log.Println("Configuration loaded")
	}

	db = database.DB()
	
    port := cfg.Port

	r := gin.Default()

	r.GET("/health", health)

	if err := r.Run(":" + port); err != nil{
		log.Fatalf("server startup error: %v", err)
	}
}