import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { API_URL } from "./constants";
import type { Room } from "./types";

interface SelectedRoomCardProps {
  room: Room;
  onBackToRooms: () => void;
}

const SelectedRoomCard = ({ room, onBackToRooms }: SelectedRoomCardProps) => {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {room.image && (
          <Box
            component="img"
            src={`${API_URL}/${room.image}`}
            alt={room.name}
            sx={{
              width: { xs: "100%", sm: 180 },
              height: 120,
              objectFit: "cover",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          />
        )}
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700 }}>{room.name}</Typography>
          <Typography variant="body2">Вместимость: {room.capacity}</Typography>
          <Typography variant="body2" color="text.secondary">
            {room.description || "Без описания"}
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          onClick={onBackToRooms}
          sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
        >
          Выбрать другую
        </Button>
      </Stack>
    </Paper>
  );
};

export default SelectedRoomCard;
