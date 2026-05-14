import { useEffect, useState } from "react";
import { Alert, Divider, Paper, Typography } from "@mui/material";
import type { UserView } from "./UserPanel";
import BookRoomView from "./views/BookRoomView";
import MyBookingsView from "./views/MyBookingsView";
import FAQView from "./views/FAQView";
import AvailabilityCalendarView from "./views/AvailabilityCalendarView";

interface UserContentProps {
  activeView: UserView;
}

const UserContent = ({ activeView }: UserContentProps) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookingsVersion, setBookingsVersion] = useState(0);

  const viewTitles: Record<UserView, string> = {
    "book-room": "Бронирование комнаты",
    "my-bookings": "Мои брони",
    "availability-calendar": "Календарь загруженности",
    faq: "Правила и FAQ",
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

      {activeView === "book-room" && (
        <BookRoomView onError={setError} onSuccess={handleBookingCreated} />
      )}
      {activeView === "my-bookings" && (
        <MyBookingsView
          bookingsVersion={bookingsVersion}
          onError={setError}
          onSuccess={handleBookingCancelled}
        />
      )}
      {activeView === "availability-calendar" && <AvailabilityCalendarView onError={setError} />}
      {activeView === "faq" && <FAQView />}
    </Paper>
  );
};

export default UserContent;
