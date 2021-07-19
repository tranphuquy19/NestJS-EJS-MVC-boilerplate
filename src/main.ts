import 'dotenv/config';

import { AppModule } from '@app/app.module';
import {
    appGlobalConfig,
    configEjsHelpers,
    configI18n,
    configServiceWorker,
    configSession,
    devConfig,
    prodConfig,
} from '@app/config';
import { NODE_ENV, PORT, sessionMaxAge } from '@config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    appGlobalConfig(app);
    configServiceWorker();

    if (NODE_ENV === 'development') {
        devConfig(app);
    } else {
        prodConfig(app);
    }

    app.useStaticAssets(join(__dirname, '..', '..', 'public'), {
        maxAge: NODE_ENV === 'development' ? 0 : sessionMaxAge,
    });
    app.setBaseViewsDir(join(__dirname, '..', '..', 'views'));
    app.setViewEngine('ejs');

    configSession(app);
    configI18n(app);
    configEjsHelpers(app);

    await app.listen(PORT, '0.0.0.0', () => {
        Logger.log(`Nest listening on http://localhost:${PORT}`, 'Bootstrap');
    });
}
bootstrap();
