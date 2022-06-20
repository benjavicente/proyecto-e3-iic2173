DC_BASE = docker-compose -f docker-compose.yml
DC-DEV = $(DC_BASE) -f docker-compose.dev.yml
DC-PROD = $(DC_BASE) -f docker-compose.prod.yml

# TODO: solo build cuando ciertos archivos cambian
.PHONY: build
build:
	$(DC-DEV) build

.PHONY: dev
dev: build
	$(DC-DEV) up --build --abort-on-container-exit

.PHONY: prod
prod:
	$(DC-PROD) up --build -d
