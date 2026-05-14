export type Room = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  image: string;
};

export type Slot = {
  id: string;
  room_id: string;
  room_name?: string;
  start_at: string;
  end_at: string;
  status?: string;
};

export type DayOccupancy = {
  date: string;
  free: number;
  booked: number;
  total: number;
};