import { useEffect, useState } from "react";
import { Stack, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useApi } from "../../../hooks/useApi";

const API_URL = "http://localhost:8080";

type Booking = {
  id: string;
  user_email?: string;
  room_name?: string;
  slot_id: string;
  status: string;
  created_at: string;
};

const BookingsView = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { setLoading, setError, authHeaders } = useApi();

  const formatDateTime = (isoDate: string) => {
    try {
      return new Date(isoDate).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoDate;
    }
  };

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${API_URL}/admin/bookings`, { headers: authHeaders });
        const bookingItems = response.data?.bookings || response.data || [];
        setBookings(bookingItems);
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить список бронирований");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, [setLoading, setError, authHeaders]);

  return (
    <Stack spacing={1.5}>
      {bookings.map((booking) => (
        <Paper key={booking.id} variant="outlined" sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 700 }}>Бронь #{booking.id.slice(0, 8)}</Typography>
          <Typography variant="body2">Статус: {booking.status}</Typography>
          <Typography variant="body2">Создано: {formatDateTime(booking.created_at)}</Typography>
          <Typography variant="body2">Комната: {booking.room_name || "—"}</Typography>
          <Typography variant="body2">Пользователь: {booking.user_email || "—"}</Typography>
        </Paper>
      ))}
    </Stack>
  );
};

export default BookingsView;