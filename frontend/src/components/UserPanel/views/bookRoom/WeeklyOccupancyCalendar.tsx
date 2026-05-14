import { CircularProgress, Divider, Paper, Stack, Typography } from "@mui/material";
import type { DayOccupancy } from "./types";

interface WeeklyOccupancyCalendarProps {
  weekOccupancy: DayOccupancy[];
  loading: boolean;
}

const formatCalendarDate = (date: string) => {
  const parsedDate = new Date(`${date}T00:00:00`);
  return parsedDate.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
};

const WeeklyOccupancyCalendar = ({ weekOccupancy, loading }: WeeklyOccupancyCalendarProps) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Календарь загруженности на неделю
        </Typography>
        <Divider />
        {loading ? (
          <Stack sx={{ py: 2, alignItems: "center" }}>
            <CircularProgress size={24} />
          </Stack>
        ) : (
          <Stack spacing={1}>
            {weekOccupancy.map((day) => (
              <Paper key={day.date} variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCalendarDate(day.date)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Доступно: {day.free} · Занято: {day.booked} · Всего: {day.total}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default WeeklyOccupancyCalendar;