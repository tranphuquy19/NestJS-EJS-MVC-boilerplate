import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { isAbsolute, join } from 'path';
import { AppModule } from './app.module';

import session from 'express-session';
import flash = require('connect-flash');
import passport from 'passport';

import redis from 'redis';
import connectRedis from 'connect-redis';
import {
    apiUrl,
    enableLogging,
    logDir,
    logFormat,
    NODE_ENV,
    onlyErrorRequests,
    PORT,
    redisPort,
    redisUrl,
    sessionMaxAge,
    sessionSecret,
} from '@config';
import helmet = require('helmet');
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';
import compression = require('compression');
import { createWriteStream } from 'fs';
import path = require('path');

import I18n from 'i18n';
import { NextFunction, Request, Response } from 'express';

I18n.configure({
    locales: ['en', 'vi'],
    directory: `./src/i18n/locales`,
    cookie: 'lang',
    defaultLocale: 'en',
    missingKeyFn: (locale, value) => {
        console.log(locale);
        console.log(value);
        return value;
    },
});

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            validationError: { target: false },
        }),
    );
    app.enable('trust proxy');

    if (NODE_ENV === 'development') {
        app.enableCors();
        app.use(morgan('short'));

        const swaggerBuilder = new DocumentBuilder()
            .setTitle('NestJS EJS MVC Boilerplate')
            .setDescription(require('../package.json').description)
            .addBearerAuth()
            .addServer(apiUrl)
            .setVersion(require('../package.json').version)
            .build();
        const docs = SwaggerModule.createDocument(app, swaggerBuilder);
        SwaggerModule.setup('/docs', app, docs); // Route to http://API_URL:PORT/docs-json to get Swagger json-docs
    } else {
        app.use(helmet());
        app.use(compression());

        if (enableLogging) {
            const logFile = isAbsolute(logDir)
                ? path.join(logDir, 'access.log')
                : join(__dirname, '..', 'logs', 'access.log');
            const accessLogStream = createWriteStream(logFile, { flags: 'a' });
            if (onlyErrorRequests)
                app.use(
                    morgan(logFormat, {
                        stream: accessLogStream,
                        skip: (req, res) => res.statusCode < 400,
                    }),
                );
            else app.use(morgan(logFormat, { stream: accessLogStream }));
        }

        app.disable('x-powered-by');
    }

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));

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
            cookie: {
                secure: false, // if true only transmit cookie over https
                httpOnly: false, // if true prevent client side JS from reading the cookie
                maxAge: sessionMaxAge, // session max age in miliseconds, restart redis server after change this value
            },
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(I18n.init);
    app.use(flash());

    app.setViewEngine('ejs');

    //handle for multiple language
    app.use((req: Request, res: Response, next: NextFunction) => {
        //set header
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT');
        res.header('Access-Control-Allow-Headers', '*');

        const lang = req.cookies['lang'] || '';
        if (!lang) {
            I18n.setLocale('en');
            res.cookie('lang', 'en', { maxAge: 86400 * 30 });
        } else I18n.setLocale(lang);

        next();
    });

    await app.listen(PORT, '0.0.0.0', () => {
        Logger.log(`Nest listening on http://0.0.0.0:${PORT}`, 'Bootstrap');
    });
}
bootstrap();
