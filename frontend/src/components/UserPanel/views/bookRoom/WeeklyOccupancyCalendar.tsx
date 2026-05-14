import {
  Box,
  Button,
  CircularProgress,
  Divider,
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
import type { DayOccupancy } from "./types";

interface WeeklyOccupancyCalendarProps {
  weekOccupancy: DayOccupancy[];
  loading: boolean;
  selectedWeekStart: string;
  onWeekChange: (newWeekStart: string) => void;
}

const parseDate = (date: string) => new Date(`${date}T00:00:00`);
const toISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const shiftDate = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const normalizeWeekStart = (date: string) => {
  const parsed = parseDate(date);
  const day = parsed.getDay();
  const delta = day === 0 ? -6 : 1 - day;
  return shiftDate(parsed, delta);
};

const formatCalendarDate = (date: string) => {
  const parsedDate = parseDate(date);
  return parsedDate.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
};

const formatWeekRange = (startDate: string, endDate: string) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return `${start.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  })} — ${end.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  })}`;
};

const WeeklyOccupancyCalendar = ({
  weekOccupancy,
  loading,
  selectedWeekStart,
  onWeekChange,
}: WeeklyOccupancyCalendarProps) => {
  const weekStartDate = normalizeWeekStart(selectedWeekStart);
  const weekEndDate = shiftDate(weekStartDate, 6);

  const occupancyByDate = new Map(
    weekOccupancy.map((day) => [day.date, day]),
  );

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = toISODate(shiftDate(weekStartDate, index));
    return (
      occupancyByDate.get(date) ?? {
        date,
        total: 0,
        free: 0,
        booked: 0,
      }
    );
  });

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "background.paper",
        borderColor: "divider",
      }}
    >
      <Stack spacing={1.5}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Календарь загруженности на неделю
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                onWeekChange(toISODate(shiftDate(weekStartDate, -7)))
              }
            >
              Предыдущая
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                onWeekChange(toISODate(shiftDate(weekStartDate, 7)))
              }
            >
              Следующая
            </Button>
          </Stack>
        </Box>

        <Typography color="text.secondary" variant="body2">
          {formatWeekRange(toISODate(weekStartDate), toISODate(weekEndDate))}
        </Typography>

        <Divider />

        {loading ? (
          <Stack sx={{ py: 2, alignItems: "center" }}>
            <CircularProgress size={24} />
          </Stack>
        ) : (
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(153, 198, 250, 0.9)" }}>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      borderBottom: 0,
                      py: 1.5,
                    }}
                  >
                    День
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      borderBottom: 0,
                      py: 1.5,
                    }}
                  >
                    Всего слотов
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      borderBottom: 0,
                      py: 1.5,
                    }}
                  >
                    Свободно
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      borderBottom: 0,
                      py: 1.5,
                    }}
                  >
                    Занято
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {weekDays.map((day, index) => (
                  <TableRow
                    key={day.date}
                    sx={{
                      backgroundColor:
                        index % 2 === 0 ? "background.default" : "background.paper",
                    }}
                  >
                    <TableCell
                      sx={{
                        py: 1.5,
                        borderBottom: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCalendarDate(day.date)}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        py: 1.5,
                        borderBottom: 1,
                        borderColor: "divider",
                      }}
                    >
                      {day.total}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        py: 1.5,
                        borderBottom: 1,
                        borderColor: "divider",
                      }}
                    >
                      {day.free}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        py: 1.5,
                        borderBottom: 1,
                        borderColor: "divider",
                      }}
                    >
                      {day.booked}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Paper>
  );
};

export default WeeklyOccupancyCalendar;