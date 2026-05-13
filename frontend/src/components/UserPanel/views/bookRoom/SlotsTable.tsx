import {
  alpha,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
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
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Выберите удобные интервалы
          </Typography>
          <Chip size="small" color="primary" label={`Выбрано: ${selectedSlotIds.length}`} />
        </Stack>
        <Divider />

        <Grid container spacing={1.25}>
          {freeSlots.map((slot) => {
            const isSelected = selectedSlotIds.includes(slot.id);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={slot.id}>
                <Paper
                  variant="outlined"
                  onClick={() => onToggleSlot(slot.id)}
                  sx={(theme) => ({
                    p: 1.5,
                    cursor: "pointer",
                    borderRadius: 2,
                    borderColor: isSelected ? "primary.main" : "divider",
                    bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : "background.paper",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: 2,
                    },
                  })}
                >
                  <Stack spacing={0.75}>
                    <Typography variant="body2" color="text.secondary">
                      Свободный слот
                    </Typography>
                    <Typography variant="h6" sx={{ lineHeight: 1.1, fontWeight: 700 }}>
                      {formatTime(slot.start_at)} — {formatTime(slot.end_at)}
                    </Typography>
                    {isSelected && <Chip size="small" color="primary" label="Выбран" sx={{ width: "fit-content" }} />}
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {freeSlots.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
            Нет свободных слотов на выбранную дату
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default SlotsTable;
