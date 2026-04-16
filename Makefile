.PHONY: up down logs ps shell test restart migrate-up migrate-down seed-up seed-down

up:
	docker-compose up -d
	@echo "Project started at http://localhost:8080"

down:
	docker-compose down

logs:
	docker-compose logs -f

ps:
	docker-compose ps

shell:
	docker-compose exec app sh

test:
	docker-compose exec app go test -v -cover ./...

restart: down up

migrate-up:
	docker-compose exec db psql -U postgres -d room_booking -f /migrations/000001_create_users_table.up.sql
	docker-compose exec db psql -U postgres -d room_booking -f /migrations/000002_create_rooms_table.up.sql
	docker-compose exec db psql -U postgres -d room_booking -f /migrations/000003_create_schedules_table.up.sql
	docker-compose exec db psql -U postgres -d room_booking -f /migrations/000004_create_slots_table.up.sql
	docker-compose exec db psql -U postgres -d room_booking -f /migrations/000005_create_bookings_table.up.sql

migrate-down:
	docker-compose exec db psql -U postgres -d room_booking -f /migrations/000005_create_bookings_table.down.sql
	docker-compose exec db psql -U postgres -d room_booking -f /migrations/000004_create_slots_table.down.sql
	docker-compose exec db psql -U postgres -d room_booking -f /migrations/000003_create_schedules_table.down.sql
	docker-compose exec db psql -U postgres -d room_booking -f /migrations/000002_create_rooms_table.down.sql
	docker-compose exec db psql -U postgres -d room_booking -f /migrations/000001_create_users_table.down.sql

seed-up:
	docker-compose exec db psql -U postgres -d room_booking -f /seeds/000001_seed_test_rooms.up.sql

seed-down:
	docker-compose exec db psql -U postgres -d room_booking -f /seeds/000001_seed_test_rooms.down.sql