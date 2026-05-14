import { List, ListItemButton, ListItemText, Paper } from "@mui/material";
import type { UserView } from "./UserPanel";

interface UserSidebarProps {
  activeView: UserView;
  onViewChange: (view: UserView) => void;
}

const UserSidebar = ({ activeView, onViewChange }: UserSidebarProps) => {
  const menuItems: Array<{ key: UserView; label: string }> = [
    { key: "instructions", label: "Как пользоваться" },
    { key: "book-room", label: "Забронировать комнату" },
    { key: "weekly-occupancy", label: "Загруженность на неделю" },
    { key: "my-bookings", label: "Мои брони" },
  ];

  return (
    <Paper elevation={2} sx={{ minWidth: 260 }}>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.key}
            selected={activeView === item.key}
            onClick={() => onViewChange(item.key)}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default UserSidebar;
