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

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roomName.trim() || !roomCapacity.trim()) {
      setError("Укажите название комнаты и вместимость");
      return;
    }

    const payload = {
    name: roomName,
    description: roomDescription,
    capacity: Number(roomCapacity),
    image: imageFile ? `static/rooms/${imageFile.name}` : null,
  };

  console.log("Creating room with data:", payload);

  setLoading(true);
  setError("");

  try {
    await axios.post(`${API_URL}/admin/rooms`, payload, {
      headers: { ...authHeaders, "Content-Type": "application/json" },
    });

      onSuccess("Комната успешно создана");
      setRoomName("");
      setRoomDescription("");
      setRoomCapacity("");
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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