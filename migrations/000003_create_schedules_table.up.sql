CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    days_of_week INT[] NOT NULL,
    start_time TIME WITHOUT TIME ZONE NOT NULL,
    end_time TIME WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_room_schedule UNIQUE (room_id),
    CONSTRAINT check_days_of_week CHECK (array_length(days_of_week, 1) > 0),
    CONSTRAINT check_time_range CHECK (start_time < end_time)
);

CREATE INDEX idx_schedules_room_id ON schedules(room_id);