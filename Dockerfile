# Base image
FROM ubuntu:20.04 AS base

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Ho_Chi_Minh

RUN apt-get update && apt-get install -y curl python2 build-essential manpages-dev make apt-utils && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs && \
    npm install --global yarn

WORKDIR /home/node/app

COPY package.json .


# Build app
FROM base AS development

COPY . .

RUN yarn install --ignore-scripts --production=false && yarn prebuild && yarn build


# Release app
FROM base AS production

RUN yarn install --ignore-scripts --production=true && \
    npm rebuild bcrypt --build-from-source && \
    rm -rf /var/lib/apt/lists/*

COPY --from=development /home/node/app/dist ./dist
COPY --from=development /home/node/app/src ./src
COPY --from=development /home/node/app/views ./views
COPY --from=development /home/node/app/public ./public
COPY ./ormconfig.js nest-cli.json ./

RUN ls -la .

CMD ["node", "./dist/src/main.js"]
