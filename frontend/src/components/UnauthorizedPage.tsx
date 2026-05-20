import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import HomeIcon from "@mui/icons-material/Home";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Нет доступа";
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <img
            src="/company.png"
            alt="RB-automatics"
            style={{ height: "50px", width: "auto", marginBottom: 20 }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              mb: 2,
              borderRadius: "50%",
              color: "error.main",
            }}
          >
            <DoDisturbIcon sx={{ fontSize: 48 }} />
          </Box>

          <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Нет прав доступа
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            У вашей учетной записи нет доступа к этому разделу системы бронирования.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
            sx={{
              textTransform: "none",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Вернуться на главную
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            © 2026 RB-automatics
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
