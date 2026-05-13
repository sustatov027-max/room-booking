import { useEffect, useState } from "react";
import { Chip, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
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

  const formatTime = (isoDate: string) => {
    try {
      return new Date(isoDate).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoDate;
    }
  };

  const getStatus = (slot: Slot) => {
    if (slot.status) return slot.status;
    if (slot.is_booked) return "booked";
    return "free";
  };

  const groupedByTime = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    const key = `${formatTime(slot.start_at)} — ${formatTime(slot.end_at)}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});

  const sortedTimeGroups = Object.entries(groupedByTime).sort((a, b) => {
    const aTime = new Date(a[1][0].start_at).getTime();
    const bTime = new Date(b[1][0].start_at).getTime();
    return aTime - bTime;
  });

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
       {sortedTimeGroups.map(([timeRange, timeSlots]) => (
        <Paper key={timeRange} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {timeRange}
            </Typography>

            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              {timeSlots.map((slot) => {
                const status = getStatus(slot);
                const chipColor = status === "booked" ? "error" : "success";
                const label = status === "booked" ? "Занят" : "Свободен";

                return (
                  <Paper key={slot.id} variant="outlined" sx={{ p: 1.25, minWidth: 220, flex: "1 1 220px" }}>
                    <Typography sx={{ fontWeight: 700 }}>{slot.room_name || slot.room_id}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
                      {formatDateTime(slot.start_at)}
                    </Typography>
                    <Chip size="small" color={chipColor} label={label} />
                  </Paper>
                );
              })}
            </Stack>
          </Stack>
        </Paper>
      ))}

      {sortedTimeGroups.length === 0 && (
        <Paper variant="outlined" sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Слоты на выбранную дату не найдены
          </Typography>
        </Paper>
      )}
    </Stack>
  );
};

export default SlotsView;
