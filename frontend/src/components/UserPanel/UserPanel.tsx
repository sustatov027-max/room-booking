import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import Header from "../Header";
import UserSidebar from "./UserSidebar";
import UserContent from "./UserContent";

export type UserView = "book-room" | "my-bookings";

const UserPanel = () => {
  const [activeView, setActiveView] = useState<UserView>("book-room");

  useEffect(() => {
    document.title = "Панель пользователя";
  }, []);

  return (
    <Container maxWidth="lg">
      <Header />
      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        <UserSidebar activeView={activeView} onViewChange={setActiveView} />
        <UserContent activeView={activeView} />
      </Box>
    </Container>
  );
};

export default UserPanel;
