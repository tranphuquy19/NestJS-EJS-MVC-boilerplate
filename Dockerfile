# syntax=docker/dockerfile:1.3

# Base image
FROM ubuntu:20.04 AS base

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Ho_Chi_Minh

RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt --mount=type=cache,target=/var/lib/apt \
    apt-get update && apt-get install -y curl python2 build-essential manpages-dev make apt-utils && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs && \
    npm install --global yarn

WORKDIR /home/node/app

COPY package.json .


# Build app
FROM base AS development

COPY . .

RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn --frozen-lockfile && \
    yarn install --ignore-scripts --production=false && yarn prebuild && yarn build


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
