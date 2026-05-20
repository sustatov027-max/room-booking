import { useEffect, useState } from "react";
import { Button, Chip, CircularProgress, Divider, Grow, Link, Paper, Stack, Typography } from "@mui/material";
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

   const getStatusMeta = (status: string) => {
    if (status === "cancelled") return { label: "Отменена", color: "default" as const };
    if (status === "booked" || status === "confirmed") return { label: "Активна", color: "success" as const };
    return { label: status, color: "warning" as const };
  };

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
      {bookings.map((booking, index) => {
        const statusMeta = getStatusMeta(booking.status);
        return (
          <Grow key={booking.id} in timeout={260 + index * 70}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack spacing={1.25}>
                <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", gap: 1.5 }}>
                  <Stack spacing={0.5}>
                    <Typography sx={{ fontWeight: 700 }}>{booking.room_name || "Комната"}</Typography>
                    <Chip size="small" color={statusMeta.color} label={statusMeta.label} sx={{ width: "fit-content" }} />
                  </Stack>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={cancellingId === booking.id || booking.status === "cancelled"}
                    sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
                  >
                    Отменить
                  </Button>
                </Stack>

                <Divider />

                <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                  <Stack spacing={0.4} sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">Начало</Typography>
                    <Typography variant="body2">{formatDateTime(booking.start_at)}</Typography>
                  </Stack>
                  <Stack spacing={0.4} sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">Окончание</Typography>
                    <Typography variant="body2">{formatDateTime(booking.end_at)}</Typography>
                  </Stack>
                </Stack>

                {booking.conference_link && (
                  <Typography variant="body2">
                    Конференция: <Link href={booking.conference_link} target="_blank" rel="noopener noreferrer">{booking.conference_link}</Link>
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Grow>
        );
      })}
      {bookings.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          У вас пока нет активных бронирований.
        </Typography>
      )}
    </Stack>
  );
};

export default MyBookingsView;
