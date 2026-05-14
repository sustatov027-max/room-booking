import { useEffect, useState } from "react";
import { Alert, Divider, Paper, Typography } from "@mui/material";
import type { UserView } from "./UserPanel";
import BookRoomView from "./views/BookRoomView";
import MyBookingsView from "./views/MyBookingsView";
import InstructionsView from "./views/InstructionsView";
import WeeklyOccupancyView from "./views/WeeklyOccupancyView";

interface UserContentProps {
  activeView: UserView;
}

const UserContent = ({ activeView }: UserContentProps) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookingsVersion, setBookingsVersion] = useState(0);

  const viewTitles: Record<UserView, string> = {
    "instructions": "Как пользоваться приложением",
    "book-room": "Бронирование комнаты",
    "weekly-occupancy": "Загруженность на неделю",
    "my-bookings": "Мои брони",
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError("");
    setSuccess("");
  }, [activeView]);

  const handleBookingCreated = () => {
    setSuccess("Бронирование успешно создано");
    setBookingsVersion((version) => version + 1);
  };

  const handleBookingCancelled = () => {
    setSuccess("Бронь отменена");
    setBookingsVersion((version) => version + 1);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, flex: 1 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {viewTitles[activeView]}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {activeView === "instructions" && <InstructionsView />}
      {activeView === "book-room" && (
        <BookRoomView onError={setError} onSuccess={handleBookingCreated} />
      )}
      {activeView === "weekly-occupancy" && <WeeklyOccupancyView onError={setError} />}
      {activeView === "my-bookings" && (
        <MyBookingsView
          bookingsVersion={bookingsVersion}
          onError={setError}
          onSuccess={handleBookingCancelled}
        />
      )}
    </Paper>
  );
};

export default UserContent;
