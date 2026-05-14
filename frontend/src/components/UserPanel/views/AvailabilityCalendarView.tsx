import { useEffect, useMemo, useState } from "react";
import { Alert, Chip, CircularProgress, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useApi } from "../../../hooks/useApi";
import { API_URL } from "./bookRoom/constants";
import type { Room, Slot } from "./bookRoom/types";

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (isoDate: string) =>
  new Date(isoDate).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

const AvailabilityCalendarView = ({ onError }: { onError: (message: string) => void }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [slotsByRoom, setSlotsByRoom] = useState<Record<string, Slot[]>>({});
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [loading, setLoading] = useState(false);
  const { authHeaders } = useApi();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      onError("");
      try {
        const roomsResponse = await axios.get(`${API_URL}/rooms`, { headers: authHeaders });
        const loadedRooms: Room[] = roomsResponse.data || [];
        setRooms(loadedRooms);

        const roomSlots = await Promise.all(
          loadedRooms.map(async (room) => {
            const slotResponse = await axios.get(`${API_URL}/slots`, {
              headers: authHeaders,
              params: { room_id: room.id, date: selectedDate },
            });
            return { roomId: room.id, slots: (slotResponse.data || []) as Slot[] };
          }),
        );

        const nextSlots: Record<string, Slot[]> = {};
        roomSlots.forEach(({ roomId, slots }) => {
          nextSlots[roomId] = slots;
        });
        setSlotsByRoom(nextSlots);
      } catch (e) {
        console.error(e);
        onError("Не удалось загрузить календарь загруженности");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authHeaders, onError, selectedDate]);

  const summary = useMemo(() => {
    const allSlots = Object.values(slotsByRoom).flat();
    const free = allSlots.filter((slot) => slot.status === "free").length;
    const busy = allSlots.length - free;
    return { free, busy, total: allSlots.length };
  }, [slotsByRoom]);

  return (
    <Stack spacing={2}>
      <TextField
        label="Дата"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ maxWidth: 260 }}
      />

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap>
        <Chip color="success" label={`Свободно: ${summary.free}`} />
        <Chip color="warning" label={`Занято: ${summary.busy}`} />
        <Chip label={`Всего слотов: ${summary.total}`} />
      </Stack>

      {loading && <CircularProgress />}

      {!loading && rooms.map((room) => {
        const slots = slotsByRoom[room.id] || [];
        return (
          <Paper key={room.id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Stack spacing={1.25}>
              <Typography sx={{ fontWeight: 700 }}>{room.name}</Typography>
              <Typography variant="body2" color="text.secondary">Вместимость: {room.capacity}</Typography>
              <Divider />
              {slots.length === 0 && <Alert severity="info">На эту дату слоты не найдены.</Alert>}
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap>
                {slots.map((slot) => (
                  <Chip
                    key={slot.id}
                    size="small"
                    color={slot.status === "free" ? "success" : "default"}
                    label={`${formatTime(slot.start_at)}–${formatTime(slot.end_at)}`}
                  />
                ))}
              </Stack>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
};

export default AvailabilityCalendarView;