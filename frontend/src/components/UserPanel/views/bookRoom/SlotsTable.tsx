import {
  Checkbox,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { Slot } from "./types";

interface SlotsTableProps {
  slots: Slot[];
  selectedSlotIds: string[];
  loading: boolean;
  onToggleSlot: (slotId: string) => void;
}

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

const SlotsTable = ({ slots, selectedSlotIds, loading, onToggleSlot }: SlotsTableProps) => {
  const freeSlots = slots.filter((slot) => slot.status !== "booked");

  if (loading) {
    return (
      <Stack sx={{ py: 4, alignItems: "center" }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell>Начало</TableCell>
            <TableCell>Окончание</TableCell>
            <TableCell>Статус</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {freeSlots.map((slot) => (
            <TableRow
              key={slot.id}
              hover
              selected={selectedSlotIds.includes(slot.id)}
              onClick={() => onToggleSlot(slot.id)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell padding="checkbox">
                <Checkbox checked={selectedSlotIds.includes(slot.id)} />
              </TableCell>
              <TableCell>{formatTime(slot.start_at)}</TableCell>
              <TableCell>{formatTime(slot.end_at)}</TableCell>
              <TableCell>Свободен</TableCell>
            </TableRow>
          ))}
          {freeSlots.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                  Нет свободных слотов на выбранную дату
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SlotsTable;
