import { Divider, Fade, Paper, Stack, Typography } from "@mui/material";

const UsageGuideSection = () => {
  return (
    <Fade in timeout={260}>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Как пользоваться приложением
          </Typography>
          <Divider />
          <Typography variant="body2" color="text.secondary">
            1. Выберите переговорную из списка комнат.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            2. Укажите дату и отметьте один или несколько свободных слотов.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            3. При необходимости добавьте ссылку на конференцию и нажмите кнопку бронирования.
          </Typography>
        </Stack>
      </Paper>
    </Fade>
  );
};

export default UsageGuideSection;
