import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import Header from "../Header";
import AdminSidebar from "./AdminSidebar";
import AdminContent from "./AdminContent";

type AdminView = "create-room" | "rooms" | "slots" | "bookings";

const AdminPanel = () => {
  const [activeView, setActiveView] = useState<AdminView>("create-room");

  useEffect(() => {
    document.title = "Админ панель";
  }, []);

  return (
    <Container maxWidth="lg">
      <Header />
      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
        <AdminContent activeView={activeView} />
      </Box>
    </Container>
  );
};

export default AdminPanel;