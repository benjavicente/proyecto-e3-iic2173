DC_BASE = docker-compose -f docker-compose.yml
DC-DEV = $(DC_BASE) -f docker-compose.dev.yml
DC-PROD = $(DC_BASE) -f docker-compose.prod.yml

.PHONY: dev
dev:
	$(DC-DEV) up --abort-on-container-exit

.PHONY: prod
prod:
	$(DC-PROD) up --build -d
