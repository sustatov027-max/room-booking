import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { API_URL } from "./constants";
import type { Room } from "./types";

interface RoomCatalogProps {
  rooms: Room[];
  loading: boolean;
  onSelectRoom: (room: Room) => void;
}

const RoomCatalog = ({ rooms, loading, onSelectRoom }: RoomCatalogProps) => {
  if (loading) {
    return (
      <Stack sx={{ py: 4, alignItems: "center" }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5}>
      {rooms.map((room) => (
        <Paper
          key={room.id}
          variant="outlined"
          sx={{
            p: 2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "180px 1fr auto" },
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
          <Stack spacing={0.5}>
            <Typography sx={{ fontWeight: 700 }}>{room.name}</Typography>
            <Typography variant="body2">Вместимость: {room.capacity}</Typography>
            <Typography variant="body2" color="text.secondary">
              {room.description || "Без описания"}
            </Typography>
          </Stack>
          <Button
            variant="contained"
            onClick={() => onSelectRoom(room)}
            sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
          >
            Забронировать
          </Button>
        </Paper>
      ))}
      {rooms.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Пока нет доступных комнат.
        </Typography>
      )}
    </Stack>
  );
};

export default RoomCatalog;
