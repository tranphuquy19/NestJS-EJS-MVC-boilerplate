import { NestExpressApplication } from '@nestjs/platform-express';

import { Logger } from '@nestjs/common';
import connectRedis from 'connect-redis';
import session from 'express-session';
import parseDuration from 'parse-duration';
import passport from 'passport';
import redis from 'redis';
import flash = require('connect-flash');

import { redisPort, redisUrl, sessionMaxAge, sessionSecret } from '@config';

export function configSession(app: NestExpressApplication) {
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    host: redisUrl,
    port: redisPort,
  });
  redisClient.on('error', (err) => {
    Logger.log(`Could not establish a connection with redis. ${err}`, 'Bootstrap');
  });
  redisClient.on('connect', () => {
    Logger.log('Connected to redis successfully', 'Bootstrap');
  });

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      name: 'sid',
      cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
        maxAge: parseDuration(sessionMaxAge, 'ms'), // session max age in milliseconds. Please restart Redis server after change this value!
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());
}
