DC-DEV = docker compose -f docker-compose.yml -f docker-compose.dev.yml


# TODO: solo build cuando ciertos archivos cambian
.PHONY: build
build: 
	$(DC-DEV) build

.PHONY: dev
dev: build
	$(DC-DEV) up
