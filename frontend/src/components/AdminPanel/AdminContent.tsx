import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import CreateRoomForm from "./views/CreateRoomForm";
import RoomsView from "./views/RoomsView";
import SlotsView from "./views/SlotsView";
import BookingsView from "./views/BookingsView";
import { useApi } from "../../hooks/useApi";
import PageTransition from "../PageTransition";

type AdminView = "create-room" | "rooms" | "slots" | "bookings";

interface AdminContentProps {
  activeView: AdminView;
}

const AdminContent = ({ activeView }: AdminContentProps) => {
  const { loading, error, setError} = useApi();
  const [success, setSuccessState] = useState("");

  const viewTitles: Record<AdminView, string> = {
    "create-room": "Создание комнаты",
    rooms: "Список всех комнат",
    slots: "Список всех слотов",
    bookings: "Список всех бронирований",
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuccessState("");
    setError("");
  }, [activeView, setError]);

  const handleSuccess = (message: string) => {
    setSuccessState(message);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, flex: 1 }}>
      <PageTransition transitionKey={activeView}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {viewTitles[activeView]}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeView === "create-room" && <CreateRoomForm onSuccess={handleSuccess} />}
            {activeView === "rooms" && <RoomsView />}
            {activeView === "slots" && <SlotsView />}
            {activeView === "bookings" && <BookingsView />}
          </>
        )}
      </PageTransition>
    </Paper>
  );
};

export default AdminContent;
