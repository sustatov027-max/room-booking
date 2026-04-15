INSERT INTO rooms (name, description, capacity, created_at) VALUES
    ('Стекляшка', 'Smart экран, длинный стол, кресла', 12, NOW()),
    ('Актовый', 'Проектор, сцена, кресла', 50, NOW()),
    ('Точка кипения', 'Smart экран, кресла', 20, NOW()),
    ('OpenSpace', 'Стол, кресла', 4, NOW()),
    ('Meeting Room', 'Длинный стол, кресла', 8, NOW())
ON CONFLICT (name) DO NOTHING;