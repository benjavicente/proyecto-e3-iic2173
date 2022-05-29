# 2022-1 / IIC2173 - E0 | De cómo volvemos a hacer grupos de amigos con contactos estrechos

## Descripción
Se implementaron todos los requisitos funcionales y no funcionales en una aplicación que utiliza KOA node.js, PostgresSQL (con PostGIS) y utilizando Sequelize como ORM. Se implementaron todaos los requisitos variables de `docker-compose` y de SSL. Todo el detalle se puede ver en la _task list_ que está en las _issues_.

## Dominio
El dominio del sitio es: iic2173-feballa-e0.tk

## Método de acceso
Se accede con SSH y las credenciales .pem adjuntadas en Canvas

## Sitio web
El sitio web está alojado en AWS EC2 y se puede acceder por la siguiente URL: https://www.iic2173-feballa-e0.tk/

## Consideraciones
El docker-compose es para producción. Si se quisiera correr local se debería ocupar una estructura como la siguiente:
```
version: "3.9"

services:
  db:
    image: cmihai/postgis
    restart: always
    volumes:
      - ./.docker/volumes/database:/var/lib/postgresql/data
    env_file:
      - .env
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    networks:                 
      - app-network

  app:
    build: .
    env_file:
      - .env
    volumes: 
      - .:/usr/app
      - /usr/app/node_modules
    depends_on:
      - db
    command: sh -c "yarn sequelize-cli db:migrate:undo:all && 
      yarn sequelize-cli db:migrate &&
      yarn sequelize-cli db:seed:all &&
      yarn start"
    networks:
      - app-network

  nginx:
    image: nginx
    volumes:
      - ./data/nginx:/etc/nginx/conf.d
    ports:
      - 80:80
    depends_on:
      - app
    networks:
      - app-network


networks:                     
  app-network:
    driver: bridge
```

Y en el archivo `./data/nginx/app.conf` debería ser de la forma:
```
server {
  listen 80 default_server;

  location / {
    proxy_pass http://app:3000;
  }
}
```

## Variables de entorno
Se requieren las siguientes variables de entorno:
```
DB_USERNAME=
DB_NAME=
DB_PASSWORD=
PORT=
DB_HOST=
DATABASE_URL=
```

## Ejecución
Los certificados iniciales (y la renovación) están dados por el _script_ `init-letsencrypt.sh`, obtenido de [este sitio](https://pentacent.medium.com/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71). Cuando se quiere levantar la instancia por primera vez se debe correr el siguiente comando:
```
sudo ./init-letsencrypt.sh
```
Luego basta con el docker-compose up.

## Comentarios adicionales
Todo el detalle de qué se implementó en cada _commit_ se puede ver en las PullRequests cerradas.
