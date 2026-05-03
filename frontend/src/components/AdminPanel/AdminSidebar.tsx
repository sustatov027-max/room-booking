import { List, ListItemButton, ListItemText, Paper } from "@mui/material";

type AdminView = "create-room" | "rooms" | "slots" | "bookings";

interface AdminSidebarProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}

const AdminSidebar = ({ activeView, onViewChange }: AdminSidebarProps) => {
  const menuItems: Array<{ key: AdminView; label: string }> = [
    { key: "rooms", label: "Все комнаты" },
    { key: "create-room", label: "Создать комнату" },
    { key: "slots", label: "Все слоты" },
    { key: "bookings", label: "Все брони" },
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

export default AdminSidebar;