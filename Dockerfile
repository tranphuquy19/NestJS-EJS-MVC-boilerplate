# Base image
FROM node:12.22.6-alpine AS base

RUN apk add yarn
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package.json .


# Build app
FROM base AS development

COPY . .

RUN yarn install --ignore-scripts --production=false && yarn build
RUN ls -la
RUN ls -la ./dist


# Release app
FROM node:12.22.6-alpine AS production

RUN yarn install --ignore-scripts --production=true

COPY --from=development /home/node/app/dist ./dist

RUN ls -la
RUN ls -la dist
RUN ls -la ./node_modules | grep dotenv

CMD ["node", "./dist/src/main.js"]
