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

func (r *BookingRepository) GetBookingByUserID(uuid string) ([]models.GetBooking, utils.MessageJSON) {
	rows, err := r.DB.Query(`
			SELECT
				b.id AS booking_id,
				u.email AS user_email,
				s.start_time AS booking_start,
				s.end_time AS booking_end,
				r.name AS room_name,
				b.status,
				b.conference_link,
				b.created_at AS booking_created_at
			FROM bookings b
			JOIN slots s ON b.slot_id = s.id
			JOIN rooms r ON s.room_id = r.id
			JOIN users u ON b.user_id = u.id
			WHERE b.user_id = $1
				AND b.status = 'active'
				AND s.start_time > NOW()
			ORDER BY s.start_time ASC;`,
		uuid)
	if err != nil {
		return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
	}
	defer rows.Close()

	bookings := make([]models.GetBooking, 0)
	for rows.Next() {
		var booking models.GetBooking
		if err = rows.Scan(&booking.ID, &booking.UserEmail, &booking.StartAt, &booking.EndAt, &booking.RoomName, &booking.Status, &booking.ConferenceLink, &booking.CreatedAt); err != nil {
			return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
		}
		bookings = append(bookings, booking)
	}

	if err = rows.Err(); err != nil {
		return nil, utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	return bookings, utils.MessageJSON{}
}

func (r *BookingRepository) DeleteBookingByID(bookingID string, userID string) utils.MessageJSON {
	row := r.DB.QueryRow(`
						UPDATE bookings
						SET status = 'cancelled'
						WHERE id = $1
							AND user_id = $2;`,
		bookingID, userID,
	)

	if err := row.Err(); err != nil {
		return utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	return utils.MessageJSON{}
}

func (r *BookingRepository) GetAllBookings(limit int, offset int) (models.PaginationBookings, utils.MessageJSON) {
	rows, err := r.DB.Query(`
			SELECT
				b.id AS booking_id,
				u.email AS user_email,
				s.start_time AS booking_start,
				s.end_time AS booking_end,
				r.name AS room_name,
				b.status,
				b.conference_link,
				b.created_at AS booking_created_at
			FROM bookings b
			JOIN slots s ON b.slot_id = s.id
			JOIN rooms r ON s.room_id = r.id
			JOIN users u ON b.user_id = u.id
			ORDER BY  b.created_at DESC
        	LIMIT $1 OFFSET $2;`,
		limit, offset)

	if err != nil {
		return models.PaginationBookings{}, utils.MessageJSON{Code: 500, Message: err.Error()}
	}
	defer rows.Close()

	bookings := make([]models.GetBooking, 0)
	for rows.Next() {
		var booking models.GetBooking
		if err = rows.Scan(&booking.ID, &booking.UserEmail, &booking.StartAt, &booking.EndAt, &booking.RoomName, &booking.Status, &booking.ConferenceLink, &booking.CreatedAt); err != nil {
			return models.PaginationBookings{}, utils.MessageJSON{Code: 500, Message: err.Error()}
		}
		bookings = append(bookings, booking)
	}

	if err = rows.Err(); err != nil {
		return models.PaginationBookings{}, utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	var total int
	err = r.DB.QueryRow("SELECT COUNT(*) FROM bookings").Scan(&total)
	if err != nil {
		return models.PaginationBookings{}, utils.MessageJSON{Code: 500, Message: err.Error()}
	}

	paginationBookings := models.PaginationBookings{Bookings: bookings, Limit: limit, Total: total}

	return paginationBookings, utils.MessageJSON{}
}
