import { useEffect, useState } from "react";
import { Chip, Divider, Pagination, Paper, Stack, Typography } from "@mui/material";
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

  const getStatusMeta = (status: string) => {
    if (status === "cancelled") return { label: "Отменена", color: "default" as const };
    if (status === "booked" || status === "confirmed") return { label: "Подтверждена", color: "success" as const };
    return { label: status, color: "warning" as const };
  };

  return (
    <Stack spacing={1.5}>
      {bookings.map((booking) => {
        const statusMeta = getStatusMeta(booking.status);
        return (
          <Paper key={booking.id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Stack spacing={1.25}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>Бронь #{booking.id.slice(0, 8)}</Typography>
                <Chip size="small" color={statusMeta.color} label={statusMeta.label} />
              </Stack>

              <Divider />

              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                <Stack spacing={0.5} sx={{ flex: 1.3 }}>
                  <Typography variant="caption" color="text.secondary">Период</Typography>
                  <Typography variant="body2">{formatDateTime(booking.start_at)} — {formatDateTime(booking.end_at)}</Typography>
                </Stack>
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Комната</Typography>
                  <Typography variant="body2">{booking.room_name || "—"}</Typography>
                </Stack>
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Пользователь</Typography>
                  <Typography variant="body2">{booking.user_email || "—"}</Typography>
                </Stack>
              </Stack>

              <Typography variant="caption" color="text.secondary">
                Создано: {formatDateTime(booking.created_at)}
              </Typography>
            </Stack>
          </Paper>
        );
      })}
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
