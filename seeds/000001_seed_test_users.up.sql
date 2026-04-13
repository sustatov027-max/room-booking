-- Вставка тестовых данных
INSERT INTO users (email, password_hash, role, created_at) VALUES
    ('admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/J4vX9XqK9XqK9XqK9XqK9XqK9XqK9', 'admin', NOW()),
    ('user1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/J4vX9XqK9XqK9XqK9XqK9XqK9XqK9', 'user', NOW()),
    ('user2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/J4vX9XqK9XqK9XqK9XqK9XqK9XqK9', 'user', NOW()),
    ('user3@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/J4vX9XqK9XqK9XqK9XqK9XqK9XqK9', 'user', NOW()),
    ('test@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/J4vX9XqK9XqK9XqK9XqK9XqK9XqK9', 'user', NOW())
ON CONFLICT (email) DO NOTHING;