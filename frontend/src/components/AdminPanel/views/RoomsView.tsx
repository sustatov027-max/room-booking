import { useEffect, useState } from "react";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
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
  const [deletingId, setDeletingId] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { setLoading, setError, authHeaders } = useApi();

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      setError("");
      setActionError("");
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

  const handleDeleteRoom = async (roomId: string, roomName: string) => {
    const confirmed = window.confirm(`Удалить комнату "${roomName}"?`);
    if (!confirmed) return;

    setDeletingId(roomId);
    setActionError("");
    setSuccessMessage("");

    try {
      await axios.delete(`${API_URL}/admin/rooms/${roomId}`, { headers: authHeaders });
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
      setSuccessMessage("Комната успешно удалена");
    } catch (e) {
      console.error(e);
      setActionError("Не удалось удалить комнату");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <Stack spacing={1.5}>
      {actionError && <Alert severity="error">{actionError}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {rooms.map((room) => (
        <Paper
          key={room.id}
          variant="outlined"
          sx={{
            p: 2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" },
            gap: 2,
            alignItems: "center",
          }}
        >
          {room.image ? (
            <Box
              component="img"
              src={`${API_URL}/${room.image}`}
              alt={room.name}
              sx={{
                width: "100%",
                height: 120,
                objectFit: "cover",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "action.hover",
              }}
            />
          ) : (
            <Box
              sx={{
                height: 120,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "action.hover",
              }}
            />
          )}
          <Stack spacing={1}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}
            >
              <Stack spacing={0.5}>
                <Typography sx={{ fontWeight: 700 }}>{room.name}</Typography>
                <Typography variant="body2">Вместимость: {room.capacity}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {room.description || "Без описания"}
                </Typography>
              </Stack>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteRoom(room.id, room.name)}
                disabled={deletingId === room.id}
                sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
              >
                Удалить
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}
      {rooms.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Список комнат пуст.
        </Typography>
      )}
    </Stack>
  );
};

export default RoomsView;
