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
ON CONFLICT (name) DO NOTHING;