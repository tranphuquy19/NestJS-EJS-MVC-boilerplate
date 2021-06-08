import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

import session from 'express-session';
import flash = require('connect-flash');
import passport from 'passport';

import redis from 'redis';
import connectRedis from 'connect-redis';
import { apiUrl, NODE_ENV, PORT, sessionMaxAge, sessionSecret } from '@config';
import helmet = require('helmet');
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            validationError: { target: false },
        }),
    );

    if (NODE_ENV === 'development') {
        app.enableCors();

        const swaggerBuilder = new DocumentBuilder()
            .setTitle('NestJs MVC Boilerplate')
            .setDescription('NestJs MVC boilerplate description')
            .addBearerAuth()
            .addServer(apiUrl)
            .setVersion(require('../package.json').version)
            .build();
        const docs = SwaggerModule.createDocument(app, swaggerBuilder);
        SwaggerModule.setup('/docs', app, docs);
    } else {
        app.use(helmet());
        app.disable('x-powered-by');
    }

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient({
        host: 'localhost',
        port: 6379,
    });
    redisClient.on('error', (err) => {
        console.error('Could not establish a connection with redis. ' + err);
    });
    redisClient.on('connect', () => {
        console.info('Connected to redis successfully');
    });

    app.use(
        session({
            store: new RedisStore({ client: redisClient }),
            secret: sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false, // if true only transmit cookie over https
                httpOnly: false, // if true prevent client side JS from reading the cookie
                maxAge: sessionMaxAge, // session max age in miliseconds, restart redis server after change this value
            },
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    app.setViewEngine('ejs');
    await app.listen(PORT);
}
bootstrap();
