import { useEffect, useState } from "react";
import { Pagination, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useApi } from "../../../hooks/useApi";

const API_URL = "http://localhost:8080";

type Booking = {
  id: string;
  user_email?: string;
  start_at: string;
  end_at: string;
  room_name?: string;
  slot_id: string;
  status: string;
  created_at: string;
};

type PaginatedBookingsResponse = {
  bookings: Booking[];
  page: number;
  limit: number;
  total: number;
};

const BookingsView = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
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
        const response = await axios.get<PaginatedBookingsResponse>(`${API_URL}/admin/bookings`, {
          headers: authHeaders,
          params: {
            page,
            limit: pageSize,
          },
        });
        setBookings(response.data?.bookings || []);
        setPage(response.data?.page || page);
        setPageSize(response.data?.limit || pageSize);
        setTotal(response.data?.total || 0);
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить список бронирований");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, [setLoading, setError, authHeaders, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Stack spacing={1.5}>
      {bookings.map((booking) => (
        <Paper key={booking.id} variant="outlined" sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 700 }}>Бронь #{booking.id.slice(0, 8)}</Typography>
          <Typography variant="body2">Статус: {booking.status}</Typography>
          <Typography variant="body2">Создано: {formatDateTime(booking.created_at)}</Typography>
          <Typography variant="body2">Период: {formatDateTime(booking.start_at)} - {formatDateTime(booking.end_at)}</Typography>
          <Typography variant="body2">Комната: {booking.room_name || "—"}</Typography>
          <Typography variant="body2">Пользователь: {booking.user_email || "—"}</Typography>
        </Paper>
      ))}
      {bookings.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Брони пока не найдены.
        </Typography>
      )}
      {total > 0 && (
        <Stack sx={{ alignItems: "center", pt: 1 }}>
          <Pagination
            color="primary"
            count={totalPages}
            page={page}
            onChange={(_, nextPage) => setPage(nextPage)}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default BookingsView;
