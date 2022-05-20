DC-DEV = docker compose -f docker-compose.yml -f docker-compose.dev.yml

.PHONY: dev
dev:
	$(DC-DEV) up --build
