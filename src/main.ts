import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

import session from 'express-session';
import flash = require('connect-flash');
import passport from 'passport';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors();
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));

    app.use(
        session({
            secret: 'nest cats',
            resave: false,
            saveUninitialized: false,
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    app.setViewEngine('ejs');
    await app.listen(4000);
}
bootstrap();
