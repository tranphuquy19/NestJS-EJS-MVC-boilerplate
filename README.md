<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Project badges

[![Total alerts](https://img.shields.io/lgtm/alerts/g/tranphuquy19/NestJS-EJS-MVC-boilerplate.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/tranphuquy19/NestJS-EJS-MVC-boilerplate/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/tranphuquy19/NestJS-EJS-MVC-boilerplate.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/tranphuquy19/NestJS-EJS-MVC-boilerplate/context:javascript)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Features

### Environments

- [x] production
- [x] development

### View engine

- [x] EJS
- [x] EJS Partials
- [ ] EJS Helpers
- [x] Page render decorator [page.decorator.ts](https://github.com/tranphuquy19/NestJS-EJS-MVC-boilerplate/blob/master/src/shared/decorators/page.decorator.ts#L3)

### API

- [x] RESTful API
- [x] API versioning decorator [api-v1.controller.ts](https://github.com/tranphuquy19/NestJS-EJS-MVC-boilerplate/blob/master/src/shared/decorators/api-v1-controller.decorator.ts#L3)
- [ ] API Pagination
- [x] Multiple domains support

### GraphQL


### Caching

- [ ] API Response
- [x] Static files
- [x] Database queries
- [ ] CDN

### Authentication

- [x] Cookies/Session
- [x] Using Redis as Session Store
- [x] Basic auth
- [x] JWT auth
- [x] Refresh token
- [ ] Web-socket auth
- [ ] OAuth Google
- [ ] OAuth Facebook
- [ ] OAuth Github
- [ ] Verify email
- [ ] Time-based One-time password (TOTP)

### Task scheduler

- [ ] Timeout
- [ ] Interval
- [ ] Cron job

### HTTP client

- [ ] RESTful client
- [ ] GraphQL client
- [ ] SOAP client

### Send mail

- [ ] Nodemailer (smtp, password)
- [ ] Email templates

### Payment

- [ ] PayPal
- [ ] Stripe

### Structure

- [x] Repository pattern
- [x] Module path Aliases

### Authorization (Access control)

- [x] Role-based Access Control (RBAC)
- [x] Attribute-based Access Control (ABAC)
- [ ] Can update grants at runtime
- [x] Implemented builder pattern

### SEO

- [x] Sitemap generator
- [ ] Google Analytics

### Notification

- [x] Self-hosted push notification
- [x] Store subscriptions in Redis
- [x] Push notification to specific users
- [x] Push notification to logged in users
- [ ] Push notification to guest users
- [ ] Unsubscribe notification
- [ ] Firebase Cloud Messaging

### I18n

- [x] Support EJS `<%= __('home') %>`, using [i18n](https://www.npmjs.com/package/i18n) package
- [x] Using Cookie

### File Uploader

- [x] Uploader decorator [uploader.decorator.ts](https://github.com/tranphuquy19/NestJS-EJS-MVC-boilerplate/blob/master/src/shared/decorators/uploader.decorator.ts#L7)
- [ ] Auto resize images
- [ ] Auto generate video thumbnails
- [ ] Cloudinary
- [ ] AWS S3

### Logging

- [x] Log requests (using [morgan](https://github.com/expressjs/morgan))
- [x] Log requests in `development` environment
- [x] Write logs to file in `production` environment

### Real-time application

- [ ] Socket.IO
- [ ] Redis Pub/Sub

### Debugging

- [ ] VScode
- [ ] Node Inspector

### Database

- [x] Pagination
- [ ] Transaction
- [x] Synchronizing Table Schemas
- [ ] Data seeding
- [ ] Multi-database

### Security

- [x] Using [helmet](https://github.com/helmetjs/helmet) package
- [x] CORS
- [ ] CRFS
- [x] Schema validation (validation pipes)
- [ ] Rate limit
- [x] LGTM scan

### Health checks

- [ ] Get stats
- [ ] Stats reports
- [ ] Email health check report

### Git hooks

- [x] Using [husky](https://www.npmjs.com/package/husky)
- [x] Linting (with lint-staged)
- [x] Prettier (just run `yarn format`)
- [x] Integrate Commitizen (use `yarn commit` instead of `git commit`)

### Backup

- [ ] Database backup

### App containerization

- [x] Dockerfile (`development`, `production`)
- [x] Docker-compose
- [ ] Kubernetes
- [ ] Skaffold

### CI/CD

- [ ] Github actions
- [ ] Circle CI
- [ ] Gitlab pipeline
- [ ] Multi-Stage pipelines

### Testing

- [ ] Unit test
- [ ] E2E
- [ ] Coverage
- [ ] Performance

### Documentations

- [x] Swagger docs `http://localhost:4000/docs`
- [x] Swagger json-docs (just append `-json` to Swagger path. Example: `http://localhost:4000/docs-json`)

