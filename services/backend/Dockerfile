FROM node:12.22.11
WORKDIR /usr/app

# Register Yarn package source.
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# using wildcard (*) to copy both package.json and package-lock.json
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

# create and set app directory as current dir
COPY . .
EXPOSE 3000