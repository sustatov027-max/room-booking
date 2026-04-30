import { useEffect, useState } from "react";
import { Stack, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useApi } from "../../../hooks/useApi";

const API_URL = "http://localhost:8080";

type Slot = {
  id: string;
  room_name?: string;
  room_id: string;
  start_at: string;
  end_at: string;
  is_booked?: boolean;
};

const SlotsView = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
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
    const loadSlots = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${API_URL}/slots`, { headers: authHeaders });
        setSlots(response.data || []);
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить список слотов");
      } finally {
        setLoading(false);
      }
    };
    loadSlots();
  }, [setLoading, setError, authHeaders]);

  return (
    <Stack spacing={1.5}>
      {slots.map((slot) => (
        <Paper key={slot.id} variant="outlined" sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 700 }}>Комната: {slot.room_name || slot.room_id}</Typography>
          <Typography variant="body2">Начало: {formatDateTime(slot.start_at)}</Typography>
          <Typography variant="body2">Окончание: {formatDateTime(slot.end_at)}</Typography>
        </Paper>
      ))}
    </Stack>
  );
};

export default SlotsView;