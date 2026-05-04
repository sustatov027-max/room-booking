import { useEffect, useState } from "react";
import { Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useApi } from "../../../hooks/useApi";

const API_URL = "http://localhost:8080";

type Booking = {
  id: string;
  room_name?: string;
  start_at: string;
  end_at: string;
  status: string;
  conference_link?: string;
  created_at: string;
};

interface MyBookingsViewProps {
  bookingsVersion: number;
  onError: (message: string) => void;
  onSuccess: () => void;
}

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

const MyBookingsView = ({ bookingsVersion, onError, onSuccess }: MyBookingsViewProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState("");
  const { authHeaders } = useApi();

  const loadBookings = async () => {
    setLoading(true);
    onError("");
    try {
      const response = await axios.get(`${API_URL}/bookings/my`, { headers: authHeaders });
      setBookings(response.data || []);
    } catch (e) {
      console.error(e);
      onError("Не удалось загрузить ваши брони");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBookings();
  }, [authHeaders, bookingsVersion]);

  const handleCancelBooking = async (bookingId: string) => {
    const confirmed = window.confirm("Отменить эту бронь?");
    if (!confirmed) return;

    setCancellingId(bookingId);
    onError("");
    try {
      await axios.delete(`${API_URL}/bookings/${bookingId}`, { headers: authHeaders });
      onSuccess();
      await loadBookings();
    } catch (e) {
      console.error(e);
      onError("Не удалось отменить бронь");
    } finally {
      setCancellingId("");
    }
  };

  if (loading) {
    return (
      <Stack sx={{ py: 4, alignItems: "center" }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5}>
      {bookings.map((booking) => (
        <Paper key={booking.id} variant="outlined" sx={{ p: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", gap: 1.5 }}>
            <Stack spacing={0.5}>
              <Typography sx={{ fontWeight: 700 }}>{booking.room_name || "Комната"}</Typography>
              <Typography variant="body2">Начало: {formatDateTime(booking.start_at)}</Typography>
              <Typography variant="body2">Окончание: {formatDateTime(booking.end_at)}</Typography>
              <Typography variant="body2">Статус: {booking.status}</Typography>
              {booking.conference_link && (
                <Typography variant="body2">Конференция: {booking.conference_link}</Typography>
              )}
            </Stack>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleCancelBooking(booking.id)}
              disabled={cancellingId === booking.id}
              sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
            >
              Отменить
            </Button>
          </Stack>
        </Paper>
      ))}
      {bookings.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          У вас пока нет активных бронирований.
        </Typography>
      )}
    </Stack>
  );
};

export default MyBookingsView;
