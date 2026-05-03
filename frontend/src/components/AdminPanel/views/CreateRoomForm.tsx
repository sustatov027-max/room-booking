import { useRef, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useApi } from "../../../hooks/useApi";

const API_URL = "http://localhost:8080";

interface CreateRoomFormProps {
  onSuccess: (message: string) => void;
}

const CreateRoomForm = ({ onSuccess }: CreateRoomFormProps) => {
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomCapacity, setRoomCapacity] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [schedulesDays, setSchedulesDays] = useState<number[]>([]);
  const [scheduleStartTime, setScheduleStartTime] = useState("09:00");
  const [scheduleEndTime, setScheduleEndTime] = useState("18:00");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { setLoading, setError, authHeaders } = useApi();

  const saveFileLocally = async (file: File) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const picker = (window as any).showSaveFilePicker;
      if (typeof picker === "function") {
        const handle = await picker({
          suggestedName: file.name,
          types: [
            {
              description: "Image file",
              accept: { "image/*": [`.${file.name.split(".").pop() || "png"}`] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(file);
        await writable.close();
      } else {
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error(error);
      setError("Не удалось сохранить картинку локально");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    setImageFile(file);
    await saveFileLocally(file);
  };

  const handleAddDay = (day: string) => {
    const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const dayIndex = (days.indexOf(day) + 1) % 7; // Индекс с воскресенья: 0=Вс, 1=Пн, ..., 6=Сб
    if (schedulesDays.includes(dayIndex)) {
      setSchedulesDays(schedulesDays.filter((d) => d !== dayIndex));
    } else {
      setSchedulesDays([...schedulesDays, dayIndex]);
    }
  };

  const handleCreateRoom = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roomName.trim() || !roomCapacity.trim()) {
      setError("Укажите название комнаты и вместимость");
      return;
    }

    const createRoomData = {
      name: roomName,
      description: roomDescription,
      capacity: Number(roomCapacity),
      image: imageFile ? `static/rooms/${imageFile.name}` : null,
    };

    console.log("Creating room with data:", createRoomData);
    console.log("Selected schedule days:", schedulesDays);
    console.log("Schedule start time:", scheduleStartTime);
    console.log("Schedule end time:", scheduleEndTime);

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/admin/rooms`, createRoomData, {
        headers: { ...authHeaders, "Content-Type": "application/json" },
      });

      setRoomName("");
      setRoomDescription("");
      setRoomCapacity("");
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      const convertToUTC = (time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const localDate = new Date();
        localDate.setHours(hours, minutes, 0, 0);
        const utcHours = localDate.getUTCHours();
        const utcMinutes = localDate.getUTCMinutes();
        return `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}:00`;
      };

      const createRoomScheduleData = {
        room_id: response.data.uuid,
        days_of_week: schedulesDays,
        start_time: convertToUTC(scheduleStartTime),
        end_time: convertToUTC(scheduleEndTime)
      }

      await axios.post(`${API_URL}/admin/schedules`, createRoomScheduleData, {
        headers: { ...authHeaders, "Content-Type": "application/json" },
      });

      setSchedulesDays([]);
      setScheduleStartTime("09:00");
      setScheduleEndTime("18:00");

      onSuccess("Комната успешно создана");
    } catch (e) {
      console.error(e);
      setError("Не удалось создать комнату");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleCreateRoom}>
      <Stack spacing={2}>
        <TextField
          label="Название комнаты"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <TextField
          label="Описание"
          value={roomDescription}
          onChange={(e) => setRoomDescription(e.target.value)}
          multiline
          minRows={2}
        />
        <TextField
          label="Вместимость"
          type="number"
          value={roomCapacity}
          onChange={(e) => setRoomCapacity(e.target.value)}
          slotProps={{
            htmlInput: {
              min: 1
            }
          }}
          required
        />

        <Typography variant="h6">Дни расписания</Typography>
        <Stack direction="row" spacing={2}>
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
            <Button
              key={day}
              variant={schedulesDays.includes((["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].indexOf(day) + 1) % 7) ? "contained" : "outlined"}
              onClick={handleAddDay.bind(null, day)}>
              {day}
            </Button>
          ))}
        </Stack>

        <Typography variant="h6">Время расписания</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Начало"
            type="time"
            value={scheduleStartTime}
            onChange={(e) => setScheduleStartTime(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { step: 1800 }
            }}
          />
          <TextField
            label="Окончание"
            type="time"
            value={scheduleEndTime}
            onChange={(e) => setScheduleEndTime(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { step: 1800 }
            }}
          />
        </Stack>
        
        <Button component="label" variant="outlined">
          {imageFile ? "Изменить изображение" : "Загрузить изображение"}
          <input
            ref={fileInputRef}
            hidden
            accept="image/*"
            type="file"
            onChange={handleFileChange}
          />
        </Button>
        {imageFile && (
          <Typography variant="body2">Выбран файл: {imageFile.name}</Typography>
        )}
        <Button type="submit" variant="contained">
          Создать
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateRoomForm;