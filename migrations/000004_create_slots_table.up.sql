CREATE TABLE IF NOT EXISTS slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_slot_duration CHECK (end_time = start_time + INTERVAL '30 minutes')
);

CREATE INDEX idx_slots_room_id ON slots(room_id);
CREATE INDEX idx_slots_room_start ON slots(room_id, start_time);
CREATE INDEX idx_slots_start_time ON slots(start_time);