package repository

import (
	"database/sql"

	"github.com/sustatov027-max/room-booking/internal/dto"
	"github.com/sustatov027-max/room-booking/internal/models"
	"github.com/sustatov027-max/room-booking/pkg/utils"
)

type BookingRepository struct {
	DB *sql.DB
}

func (r *BookingRepository) AddBooking(booking dto.CreateBookingDTO) (string, utils.MessageJSON) {
	var UUID string

	err := r.DB.QueryRow(`
						INSERT INTO bookings(slot_id, user_id, conference_link)
						VALUES ($1, $2, $3)
						RETURNING id;`,
		booking.SlotID, booking.UserID, booking.ConferenceLink,
	).Scan(&UUID)

	if err != nil {
		return "", utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	return UUID, utils.MessageJSON{}
}

func (r *BookingRepository) GetBookingByUserID(uuid string) ([]models.Booking, utils.MessageJSON){
	rows, err := r.DB.Query(`
			SELECT id, slot_id, user_id, status, conference_link, created_at
			FROM bookings
			WHERE user_id = $1;`,
		uuid)
	if err != nil {
		return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
	}
	defer rows.Close()

	bookings := make([]models.Booking, 0)
	for rows.Next(){
		var booking models.Booking
		if err = rows.Scan(&booking.ID, &booking.SlotID, &booking.UserID, &booking.Status, &booking.ConferenceLink, &booking.CreatedAt); err != nil{
			return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
		}
		bookings = append(bookings, booking)
	}

	if err = rows.Err(); err != nil {
		return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	return bookings, utils.MessageJSON{}
}
