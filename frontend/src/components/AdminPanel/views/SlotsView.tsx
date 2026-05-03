import { useEffect, useState } from "react";
import { MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
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
  status?: string;
};

type Room = {
  id: string;
  name: string;
};

const SlotsView = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedRoomId, setSelectedRoomId] = useState("");
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
    const loadRooms = async () => {
      try {
        const response = await axios.get(`${API_URL}/rooms`, { headers: authHeaders });
        setRooms(response.data || []);
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить список комнат");
      }
    };
    loadRooms();
  }, [setError, authHeaders]);

  useEffect(() => {
    const loadSlots = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${API_URL}/slots`, {
          headers: authHeaders,
          params: {
            date: selectedDate,
            room_id: selectedRoomId || undefined,
          },
        });
        setSlots(response.data || []);
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить список слотов");
      } finally {
        setLoading(false);
      }
    };
    loadSlots();
  }, [setLoading, setError, authHeaders, selectedDate, selectedRoomId]);

  return (
    <Stack spacing={1.5}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <TextField
          label="Дата"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />
        <TextField
          label="Комната"
          value={selectedRoomId}
          onChange={(e) => setSelectedRoomId(e.target.value)}
          select
          fullWidth
        >
          <MenuItem value="">Все комнаты</MenuItem>
          {rooms.map((room) => (
            <MenuItem key={room.id} value={room.id}>
              {room.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      {slots.map((slot) => (
        <Paper key={slot.id} variant="outlined" sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 700 }}>Комната: {slot.room_name || slot.room_id}</Typography>
          <Typography variant="body2">Начало: {formatDateTime(slot.start_at)}</Typography>
          <Typography variant="body2">Окончание: {formatDateTime(slot.end_at)}</Typography>
          {slot.status && <Typography variant="body2">Статус: {slot.status}</Typography>}
        </Paper>
      ))}
    </Stack>
  );
};

export default SlotsView;
