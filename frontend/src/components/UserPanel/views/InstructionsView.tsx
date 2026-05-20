import {
  CalendarMonth,
  Groups,
  MeetingRoom,
  Rule,
  Schedule,
  Verified,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  Fade,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const companyHighlights = [
  {
    icon: <MeetingRoom />,
    title: "Удобные переговорные",
    text: "Комнаты для встреч, созвонов и командной работы собраны в одном каталоге.",
  },
  {
    icon: <Schedule />,
    title: "Понятное расписание",
    text: "Свободные слоты видны сразу, поэтому бронирование занимает меньше минуты.",
  },
  {
    icon: <Groups />,
    title: "Комфорт для команды",
    text: "Сервис помогает планировать встречи без лишних сообщений и пересечений.",
  },
];

const usageRules = [
  "Выбирайте комнату по вместимости, оборудованию и доступному времени.",
  "Бронируйте только нужные слоты, чтобы расписание оставалось честным для всех.",
  "Добавляйте ссылку на онлайн-конференцию, если встреча проходит в гибридном формате.",
  "Отменяйте бронь заранее, если встреча переносится или комната больше не нужна.",
];

const InstructionsView = () => {
  return (
    <Fade in timeout={320}>
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(135deg, rgba(25,118,210,0.10), rgba(46,125,50,0.08) 55%, rgba(255,167,38,0.12))",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack
              spacing={2.5}
              sx={{
                p: { xs: 3, md: 5 },
                justifyContent: "center",
              }}
            >
              <Box>
                <Typography
                  component="h2"
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: 34, md: 44 },
                    lineHeight: 1.08,
                    mb: 1.5,
                  }}
                >
                  Простое бронирование комнат для продуктивных встреч
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 620, fontSize: 17, lineHeight: 1.7 }}
                >
                  Компания создает удобную среду для совместной работы: сотрудники
                  быстро находят свободные переговорные, планируют встречи и видят
                  актуальную загруженность комнат на неделю вперед.
                </Typography>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Chip icon={<Verified />} label="Актуальные слоты" />
                <Chip icon={<CalendarMonth />} label="Планирование на неделю" />
              </Stack>
            </Stack>

            <Box
              sx={{
                px: { xs: 2.5, md: 5 },
                pb: { xs: 2.5, md: 5 },
                display: "flex",
                alignItems: "stretch",
              }}
            >
              <Box
                component="img"
                src="companyPicture.png"
                alt="Фото компании"
                sx={{
                  width: "100%",
                  height: { xs: 260, sm: 340, md: 420 },
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "rgba(255,255,255,0.74)",
                  display: "block",
                  objectFit: "cover",
                  boxShadow: "0 18px 42px rgba(25, 118, 210, 0.16)",
                }}
              />
            </Box>
          </Box>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
            pb: 1,
          }}
        >
          {companyHighlights.map((item) => (
            <Paper
              key={item.title}
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2,
                minHeight: 190,
                transition: (theme) =>
                  theme.transitions.create(["border-color", "box-shadow"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                "&:hover": {
                  borderColor: "primary.light",
                  boxShadow: "0 10px 28px rgba(25, 118, 210, 0.12)",
                },
              }}
            >
              <Stack spacing={1.5} sx={{ height: "100%" }}>
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    color: "primary.main",
                    bgcolor: "primary.50",
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                  {item.text}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Box>

        <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3 }}>
          <Stack spacing={2.25}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Rule color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Правила использования приложения
              </Typography>
            </Stack>
            <Divider />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: 1.5,
              }}
            >
              {usageRules.map((rule, index) => (
                <Stack
                  key={rule}
                  direction="row"
                  spacing={1.5}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      flex: "0 0 auto",
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      color: "primary.contrastText",
                      bgcolor: "primary.main",
                      fontWeight: 800,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="body2" sx={{ lineHeight: 1.65 }}>
                    {rule}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Fade>
  );
};

export default InstructionsView;
