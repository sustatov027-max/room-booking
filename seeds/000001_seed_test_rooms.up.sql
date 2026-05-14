WITH inserted_rooms AS (
    INSERT INTO rooms (name, description, capacity, image, created_at) VALUES
        ('Стекляшка', 'Smart экран, длинный стол, кресла', 12, 'static/rooms/room_1.jpg', NOW()),
        ('Актовый', 'Проектор, сцена, кресла', 50, 'static/rooms/room_2.jpg', NOW()),
        ('Точка кипения', 'Smart экран, кресла', 20, 'static/rooms/room_3.jpg', NOW()),
        ('OpenSpace', 'Стол, кресла', 4, 'static/rooms/room_4.jpg', NOW()),
        ('Meeting Room', 'Длинный стол, кресла', 8, 'static/rooms/room_5.jpg', NOW()),
        ('Executive', 'VIP-место, кожаные кресла, большой экран, мини-бар', 14, 'static/rooms/room_6.jpg', NOW()),
        ('Boardroom', 'Овальный стол, президиум, видеоконференция, презентеры', 16, 'static/rooms/room_7.jpg', NOW()),
        ('Strategy', 'Тактильная доска, мозговой штурм, маркеры, стикеры', 10, 'static/rooms/room_8.jpg', NOW()),
        ('Капсула', 'Звукоизоляция, кресло, розетка, Wi-Fi', 1, 'static/rooms/room_9.jpg', NOW()),
        ('Тандем', 'Два кресла, маленький стол, доска', 2, 'static/rooms/room_10.jpg', NOW()),
        ('Микро', 'Стол-трансформер, стулья, розетки', 3, 'static/rooms/room_11.jpg', NOW()),
        ('Лаунж', 'Мягкие диваны, журнальный столик, чай/кофе', 6, 'static/rooms/room_12.jpg', NOW()),
        ('Патио', 'Открытая веранда, стол, зонт, розетки', 10, 'static/rooms/room_13.jpg', NOW()),
        ('15 минут', 'Для быстрых встреч, стойка, табуреты', 3, 'static/rooms/room_14.jpg', NOW()),
        ('Стендап', 'Без стульев, стоя, быстро', 8, 'static/rooms/room_15.jpg', NOW()),
        ('Холл', 'Открытое пространство, диваны, столики', 6, 'static/rooms/room_16.jpg', NOW())
    ON CONFLICT (name) DO NOTHING
    RETURNING id
),
test_rooms AS (
    SELECT id, name FROM rooms WHERE name IN (
        'Стекляшка','Актовый','Точка кипения','OpenSpace','Meeting Room','Executive','Boardroom','Strategy',
        'Капсула','Тандем','Микро','Лаунж','Патио','15 минут','Стендап','Холл'
    )
),
upsert_schedules AS (
    INSERT INTO schedules (room_id, days_of_week, start_time, end_time)
    SELECT tr.id, ARRAY[1,2,3,4,5], '09:00:00'::time, '18:00:00'::time
    FROM test_rooms tr
    ON CONFLICT (room_id)
    DO UPDATE SET
        days_of_week = EXCLUDED.days_of_week,
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time
    RETURNING room_id
),
month_days AS (
    SELECT generate_series(
        date_trunc('month', CURRENT_DATE)::date,
        (date_trunc('month', CURRENT_DATE) + interval '1 month - 1 day')::date,
        interval '1 day'
    )::date AS day
),
work_days AS (
    SELECT day FROM month_days WHERE EXTRACT(ISODOW FROM day) BETWEEN 1 AND 5
),
slot_starts AS (
    SELECT tr.id AS room_id, wd.day, gs AS slot_start
    FROM test_rooms tr
    CROSS JOIN work_days wd
    CROSS JOIN generate_series(
        wd.day::timestamp + time '09:00',
        wd.day::timestamp + time '17:30',
        interval '30 minutes'
    ) gs
)
INSERT INTO slots (room_id, start_time, end_time)
SELECT ss.room_id, ss.slot_start, ss.slot_start + interval '30 minutes'
FROM slot_starts ss
WHERE NOT EXISTS (
    SELECT 1 FROM slots s
    WHERE s.room_id = ss.room_id
      AND s.start_time = ss.slot_start
      AND s.end_time = ss.slot_start + interval '30 minutes'
);
