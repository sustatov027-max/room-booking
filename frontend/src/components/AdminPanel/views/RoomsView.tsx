import { useEffect, useState } from "react";
import { Stack, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useApi } from "../../../hooks/useApi";

const API_URL = "http://localhost:8080";

type Room = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  image: string;
};

const RoomsView = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { setLoading, setError, authHeaders } = useApi();

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${API_URL}/rooms`, { headers: authHeaders });
        setRooms(response.data || []);
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить список комнат");
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, [setLoading, setError, authHeaders]);

  return (
    <Stack spacing={1.5}>
      {rooms.map((room) => (
        <Paper key={room.id} variant="outlined" sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={`${API_URL}/${room.image}`} alt={room.name} style={{ width: "80%", maxHeight: "200", objectFit: "scale-down", marginBottom: 8}} />
          <Typography sx={{ fontWeight: 700 }}>{room.name}</Typography>
          <Typography variant="body2">Вместимость: {room.capacity}</Typography>
          <Typography variant="body2" color="text.secondary">
            {room.description || "Без описания"}
          </Typography>
        </Paper>
      ))}
    </Stack>
  );
};

export default RoomsView;