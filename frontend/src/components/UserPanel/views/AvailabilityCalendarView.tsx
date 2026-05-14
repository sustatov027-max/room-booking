import { useEffect, useMemo, useState } from "react";
import { Alert, Chip, CircularProgress, IconButton, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useApi } from "../../../hooks/useApi";
import { API_URL } from "./bookRoom/constants";
import type { Slot } from "./bookRoom/types";

type DayStat = { date: string; free: number; busy: number; total: number };

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const monthTitle = (date: Date) => date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });

const AvailabilityCalendarView = ({ onError }: { onError: (message: string) => void }) => {
  const [cursorMonth, setCursorMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [statsByDate, setStatsByDate] = useState<Record<string, DayStat>>({});
  const [loading, setLoading] = useState(false);
  const { authHeaders } = useApi();

  useEffect(() => {
    const loadMonthStats = async () => {
      setLoading(true);
      onError("");
      try {
        const start = new Date(cursorMonth.getFullYear(), cursorMonth.getMonth(), 1);
        const end = new Date(cursorMonth.getFullYear(), cursorMonth.getMonth() + 1, 0);
        const dates: string[] = [];

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(formatDateKey(d));
        }

        const responses = await Promise.all(
          dates.map((date) => axios.get(`${API_URL}/slots`, { headers: authHeaders, params: { date } })),
        );

        const nextStats: Record<string, DayStat> = {};
        responses.forEach((response, i) => {
          const date = dates[i];
          const slots = (response.data || []) as Slot[];
          const free = slots.filter((slot) => slot.status === "free").length;
          const busy = slots.length - free;
          nextStats[date] = { date, free, busy, total: slots.length };
        });

        setStatsByDate(nextStats);
      } catch (e) {
        console.error(e);
        onError("Не удалось загрузить календарь загруженности");
      } finally {
        setLoading(false);
      }
    };

    loadMonthStats();
  }, [authHeaders, cursorMonth, onError]);

  const calendarCells = useMemo(() => {
    const year = cursorMonth.getFullYear();
    const month = cursorMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leadingEmpty = (firstDay.getDay() + 6) % 7;

    const cells: Array<{ date: string | null }> = [];
    for (let i = 0; i < leadingEmpty; i += 1) cells.push({ date: null });

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ date: formatDateKey(new Date(year, month, day)) });
    }

    while (cells.length % 7 !== 0) cells.push({ date: null });
    return cells;
  }, [cursorMonth]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <IconButton onClick={() => setCursorMonth(new Date(cursorMonth.getFullYear(), cursorMonth.getMonth() - 1, 1))}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" sx={{ textTransform: "capitalize" }}>{monthTitle(cursorMonth)}</Typography>
        <IconButton onClick={() => setCursorMonth(new Date(cursorMonth.getFullYear(), cursorMonth.getMonth() + 1, 1))}>
          <ChevronRightIcon />
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={1}>
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
          <Paper key={day} variant="outlined" sx={{ flex: 1, py: 1, textAlign: 'center', fontWeight: 600 }}>{day}</Paper>
        ))}
      </Stack>

      {loading && <CircularProgress />}

      {!loading && (
        <Stack spacing={1}>
          {Array.from({ length: calendarCells.length / 7 }, (_, rowIndex) => (
            <Stack key={rowIndex} direction="row" spacing={1}>
              {calendarCells.slice(rowIndex * 7, rowIndex * 7 + 7).map((cell, i) => {
                if (!cell.date) {
                  return <Paper key={`${rowIndex}-${i}`} variant="outlined" sx={{ flex: 1, minHeight: 96 }} />;
                }
                const stat = statsByDate[cell.date] || { total: 0, free: 0, busy: 0 };
                return (
                  <Paper key={cell.date} variant="outlined" sx={{ flex: 1, p: 1.2, minHeight: 96 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2">{cell.date.slice(-2)}</Typography>
                      <Chip size="small" color="success" label={`Своб: ${stat.free}`} />
                      <Chip size="small" color="default" label={`Зан: ${stat.busy}`} />
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          ))}
        </Stack>
      )}

      {!loading && Object.keys(statsByDate).length === 0 && <Alert severity="info">Нет данных за выбранный месяц.</Alert>}
    </Stack>
  );
};

export default AvailabilityCalendarView;
