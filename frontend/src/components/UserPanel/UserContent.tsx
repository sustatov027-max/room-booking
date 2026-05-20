import { useEffect, useState } from "react";
import { Alert, Divider, Paper, Typography } from "@mui/material";
import PageTransition from "../PageTransition";
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
    "instructions": "Информация",
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

  const renderActiveView = () => {
    if (activeView === "instructions") return <InstructionsView />;
    if (activeView === "book-room") {
      return <BookRoomView onError={setError} onSuccess={handleBookingCreated} />;
    }
    if (activeView === "weekly-occupancy") return <WeeklyOccupancyView onError={setError} />;
    return (
      <MyBookingsView
        bookingsVersion={bookingsVersion}
        onError={setError}
        onSuccess={handleBookingCancelled}
      />
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 3, flex: 1 }}>
      <PageTransition transitionKey={activeView}>
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

        {renderActiveView()}
      </PageTransition>
    </Paper>
  );
};

export default UserContent;
