package repository

import (
	"database/sql"

	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type BookingRepository struct {
	DB *sql.DB
}

func (r *BookingRepository) AddBooking(booking dto.CreateBookingDTO) (string, utils.MessageJSON){
	var UUID string

	err := r.DB.QueryRow(`
						INSERT INTO bookings(slot_id, user_id, conference_link)
						VALUES ($1, $2, $3)
						RETURNING id;`,
					booking.SlotID, booking.UserID, booking.ConferenceLink,
					).Scan(&UUID)

	if err != nil{
		return "", utils.MessageJSON{Code:500, Message: err.Error()}
	}

	return UUID, utils.MessageJSON{}
}
