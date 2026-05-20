import { useEffect, useState } from "react";
import { Button, Fade, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useApi } from "../../../hooks/useApi";
import { API_URL } from "./bookRoom/constants";
import RoomCatalog from "./bookRoom/RoomCatalog";
import SelectedRoomCard from "./bookRoom/SelectedRoomCard";
import SlotsTable from "./bookRoom/SlotsTable";
import type { Room, Slot } from "./bookRoom/types";

interface BookRoomViewProps {
  onError: (message: string) => void;
  onSuccess: () => void;
}

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const BookRoomView = ({ onError, onSuccess }: BookRoomViewProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [conferenceLink, setConferenceLink] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { authHeaders } = useApi();

  const loadSlots = async () => {
    if (!selectedRoom || !selectedDate) {
      setSlots([]);
      setSelectedSlotIds([]);
      return;
    }

    setLoadingSlots(true);
    onError("");
    try {
      const response = await axios.get(`${API_URL}/slots`, {
        headers: authHeaders,
        params: {
          room_id: selectedRoom.id,
          date: selectedDate,
        },
      });
      setSlots(response.data || []);
      setSelectedSlotIds([]);
    } catch (e) {
      console.error(e);
      onError("Не удалось загрузить слоты");
    } finally {
      setLoadingSlots(false);
    }
  };

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSlots();
  }, [selectedRoom, selectedDate]);

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setSlots([]);
    setSelectedSlotIds([]);
    setConferenceLink("");
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
    setSlots([]);
    setSelectedSlotIds([]);
    setConferenceLink("");
  };

  const handleToggleSlot = (slotId: string) => {
    setSelectedSlotIds((currentSlotIds) =>
      currentSlotIds.includes(slotId)
        ? currentSlotIds.filter((currentSlotId) => currentSlotId !== slotId)
        : [...currentSlotIds, slotId],
    );
  };

  const handleCreateBooking = async () => {
    if (selectedSlotIds.length === 0) {
      onError("Выберите хотя бы один свободный слот");
      return;
    }

    setBookingLoading(true);
    onError("");
    try {
      await Promise.all(
        selectedSlotIds.map((slotId) =>
          axios.post(
            `${API_URL}/bookings`,
            {
              slot_id: slotId,
              conference_link: conferenceLink.trim() || "",
            },
            {
              headers: { ...authHeaders, "Content-Type": "application/json" },
            },
          ),
        ),
      );
      setConferenceLink("");
      onSuccess();
      await loadSlots();
    } catch (e) {
      console.error(e);
      onError("Не удалось создать бронь");
    } finally {
      setBookingLoading(false);
    }
  };

  if (!selectedRoom) {
    return (
      <RoomCatalog rooms={rooms} loading={loadingRooms} onSelectRoom={handleSelectRoom} />
    );
  }

  return (
    <Fade in timeout={260}>
      <Stack spacing={2}>
        <SelectedRoomCard room={selectedRoom} onBackToRooms={handleBackToRooms} />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <TextField
            label="Дата"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Stack>

        <TextField
          label="Ссылка на конференцию"
          value={conferenceLink}
          onChange={(e) => setConferenceLink(e.target.value)}
          placeholder="Можно оставить пустым"
          fullWidth
        />

        <SlotsTable
          slots={slots}
          selectedSlotIds={selectedSlotIds}
          loading={loadingSlots}
          onToggleSlot={handleToggleSlot}
        />

        <Button
          variant="contained"
          onClick={handleCreateBooking}
          disabled={selectedSlotIds.length === 0 || bookingLoading}
        >
          Забронировать выбранные слоты
        </Button>
      </Stack>
    </Fade>
  );
};

export default BookRoomView;
