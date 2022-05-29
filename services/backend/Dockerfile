FROM node:16-alpine AS deps

WORKDIR /usr/app

# Register Yarn package source.
# RUN npm install --global yarn

# using wildcard (*) to copy both package.json and package-lock.json
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

# create and set app directory as current dir
COPY . .
EXPOSE 3000