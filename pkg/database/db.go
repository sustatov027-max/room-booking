package database

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/sustatov027-max/room-booking/pkg/config"
)


var dbase *sql.DB

func Init() *sql.DB{
	if dbase != nil{
		return dbase
	}

	cfg := config.MustGet()

	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
						cfg.PostgresUser, cfg.PostgresPassword, cfg.DBHost, cfg.DBPort, cfg.PostgresName)
	
	db, err := sql.Open("postgres", connStr)
	if err != nil{
		log.Fatal(err.Error())
	}

	if err := db.Ping(); err != nil {
        log.Fatal("Ошибка подключения:", err)
    }

	dbase = db
	return dbase
}

func DB() *sql.DB{
	if dbase == nil{
		dbase = Init()
	}
	return dbase
}

func Close() error {
    if dbase != nil {
        return dbase.Close()
    }
    return nil
}