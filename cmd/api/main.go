package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func infoCheck (ctx *gin.Context){
	connStr := "postgres://postgres:2556625@db:5432/room_booking?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil{
		log.Fatal(err.Error())
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
        log.Fatal("Ошибка подключения:", err)
    }
	

	ctx.IndentedJSON(200, "status: Success connected DB")
}

func main() {
    port := os.Getenv("SERVER_PORT")
    if port == "" {
        port = "8080"
    }

	r := gin.New()
	
	r.Use(gin.Logger())

	r.GET("/_info", infoCheck)

	if err := r.Run(":" + port); err != nil{
		log.Fatalf("server startup error: %v", err)
	}
}