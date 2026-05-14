import { useEffect, useState } from "react";
import axios from "axios";
import { Stack } from "@mui/material";
import { useApi } from "../../../hooks/useApi";
import { API_URL } from "./bookRoom/constants";
import RoomCatalog from "./bookRoom/RoomCatalog";
import SelectedRoomCard from "./bookRoom/SelectedRoomCard";
import WeeklyOccupancyCalendar from "./bookRoom/WeeklyOccupancyCalendar";
import type { DayOccupancy, Room, Slot } from "./bookRoom/types";

interface WeeklyOccupancyViewProps {
  onError: (message: string) => void;
}

const getWeekDays = () => {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() + diffToMonday);

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + index);
    return `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
  });
};

const WeeklyOccupancyView = ({ onError }: WeeklyOccupancyViewProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [weekOccupancy, setWeekOccupancy] = useState<DayOccupancy[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [weekOccupancyLoading, setWeekOccupancyLoading] = useState(false);
  const { authHeaders } = useApi();

  useEffect(() => {
    const loadRooms = async () => {
      setLoadingRooms(true);
      onError("");
      try {
        const response = await axios.get(`${API_URL}/rooms`, { headers: authHeaders });
        setRooms(response.data || []);
      } catch (e) {
        console.error(e);
        onError("Не удалось загрузить список комнат");
      } finally {
        setLoadingRooms(false);
      }
    };

    loadRooms();
  }, [authHeaders, onError]);

  useEffect(() => {
    const loadWeekOccupancy = async () => {
      if (!selectedRoom) {
        setWeekOccupancy([]);
        return;
      }

      setWeekOccupancyLoading(true);
      onError("");
      try {
        const weekDays = getWeekDays();
        const responses = await Promise.all(
          weekDays.map((date) =>
            axios.get(`${API_URL}/slots`, {
              headers: authHeaders,
              params: { room_id: selectedRoom.id, date },
            }),
          ),
        );

        const occupancy = responses.map((response, index) => {
          const dailySlots: Slot[] = response.data || [];
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
  }, [authHeaders, onError, selectedRoom]);

  if (!selectedRoom) {
    return <RoomCatalog rooms={rooms} loading={loadingRooms} onSelectRoom={setSelectedRoom} />;
  }

  return (
    <Stack spacing={2}>
      <SelectedRoomCard room={selectedRoom} onBackToRooms={() => setSelectedRoom(null)} />
      <WeeklyOccupancyCalendar weekOccupancy={weekOccupancy} loading={weekOccupancyLoading} />
    </Stack>
  );
};

export default WeeklyOccupancyView;