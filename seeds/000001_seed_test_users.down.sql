-- Удаление тестовых данных
DELETE FROM users WHERE email IN (
    'admin@example.com',
    'user1@example.com', 
    'user2@example.com',
    'user3@example.com',
    'test@example.com'
);