package models

type PaginationBookings struct {
	Bookings []GetBooking `json:"bookings"`
	Page     int          `json:"page"`
	Limit    int          `json:"limit"`
	Total    int          `json:"total"`
}
