import { useEffect, useState } from "react";
import axios from "axios";
import { Fade, Stack } from "@mui/material";
import { useApi } from "../../../hooks/useApi";
import { API_URL } from "./bookRoom/constants";
import WeeklyOccupancyCalendar from "./bookRoom/WeeklyOccupancyCalendar";
import type { DayOccupancy } from "./bookRoom/types";

const toISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() + diffToMonday);
  return toISODate(monday);
};

const getWeekDays = (weekStart: string) => {
  const [year, month, day] = weekStart.split("-").map(Number);
  const start = new Date(year, month - 1, day);
  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    return toISODate(current);
  });
};

interface WeeklyOccupancyViewProps {
  onError: (message: string) => void;
}

const WeeklyOccupancyView = ({ onError }: WeeklyOccupancyViewProps) => {
  const [weekOccupancy, setWeekOccupancy] = useState<DayOccupancy[]>([]);
  const [selectedWeekStart, setSelectedWeekStart] = useState<string>(getWeekStart());
  const [weekOccupancyLoading, setWeekOccupancyLoading] = useState(false);
  const { authHeaders } = useApi();

  useEffect(() => {
    const loadWeekOccupancy = async () => {
      setWeekOccupancyLoading(true);
      onError("");
      try {
        const weekDays = getWeekDays(selectedWeekStart);
        const responses = await Promise.all(
          weekDays.map((date) =>
            axios.get(`${API_URL}/slots`, {
              headers: authHeaders,
              params: { date },
            }),
          ),
        );

        const occupancy = responses.map((response, index) => {
          const dailySlots: Array<{ status: string }> = response.data || [];
          const booked = dailySlots.filter((slot) => slot.status === "booked").length;
          return {
            date: weekDays[index],
            free: dailySlots.length - booked,
            booked,
            total: dailySlots.length,
          };
        });

        setWeekOccupancy(occupancy);
      } catch (e) {
        console.error(e);
        onError("Не удалось загрузить календарь загруженности");
      } finally {
        setWeekOccupancyLoading(false);
      }
    };

    loadWeekOccupancy();
  }, [authHeaders, onError, selectedWeekStart]);

  return (
    <Fade in timeout={260}>
      <Stack spacing={2}>
        <WeeklyOccupancyCalendar
          weekOccupancy={weekOccupancy}
          loading={weekOccupancyLoading}
          selectedWeekStart={selectedWeekStart}
          onWeekChange={setSelectedWeekStart}
        />
      </Stack>
    </Fade>
  );
};

export default WeeklyOccupancyView;
