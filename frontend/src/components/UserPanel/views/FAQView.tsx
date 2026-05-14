import { Accordion, AccordionDetails, AccordionSummary, Alert, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQView = () => {
  return (
    <Stack spacing={2}>
      <Alert severity="info">
        Краткие правила помогут быстрее забронировать переговорную и избежать конфликтов по слотам.
      </Alert>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 600 }}>Как правильно бронировать комнату?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem>
              <ListItemText primary="1) Выберите комнату и дату." />
            </ListItem>
            <ListItem>
              <ListItemText primary="2) Отметьте один или несколько свободных слотов подряд." />
            </ListItem>
            <ListItem>
              <ListItemText primary="3) Добавьте ссылку на конференцию (если встреча гибридная/онлайн)." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 600 }}>Политика отмены</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary">
            Если встреча отменяется, снимите бронь как можно раньше в разделе «Мои брони». Это освобождает слот для коллег.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 600 }}>Типовые ошибки</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem>
              <ListItemText primary="Слот уже занят — попробуйте соседние интервалы или другую комнату." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Нет ссылки на созвон — добавьте её при необходимости в поле «Ссылка на конференцию»." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default FAQView;
