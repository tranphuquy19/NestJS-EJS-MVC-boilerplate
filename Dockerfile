# Base image
FROM ubuntu:20.04 AS base

RUN apt-get update && apt-get install -y curl python2 build-essential manpages-dev make
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs && \
    npm install --global yarn

WORKDIR /home/node/app

COPY package.json .


# Build app
FROM base AS development

COPY . .

RUN yarn install --ignore-scripts --production=false && yarn prebuild && yarn build


# Release app
FROM base AS production

RUN yarn install --ignore-scripts --production=true
RUN npm rebuild bcrypt --build-from-source

COPY --from=development /home/node/app/dist ./dist
COPY --from=development /home/node/app/src ./src
COPY ./firebase.spec.json ./firebase.spec.json

RUN ls -la .

CMD ["node", "./dist/src/main.js"]
