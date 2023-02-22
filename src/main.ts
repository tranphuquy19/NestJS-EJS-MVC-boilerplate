import '@shared/env-loader';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';

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
import {
  LISTEN_ON,
  NODE_ENV,
  PORT,
  sessionMaxAge,
  staticAssetsFolder,
  WORKING_DIR,
} from '@config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  appGlobalConfig(app);
  configServiceWorker();

  if (NODE_ENV === 'development') {
    devConfig(app);
  } else {
    prodConfig(app);
  }

  if (staticAssetsFolder && staticAssetsFolder.length > 0) {
    // staticAssetsFolder is absolute path
    app.useStaticAssets(staticAssetsFolder, {
      maxAge: NODE_ENV === 'development' ? 0 : sessionMaxAge,
    });
  } else {
    app.useStaticAssets(join(WORKING_DIR, 'public'), {
      maxAge: NODE_ENV === 'development' ? 0 : sessionMaxAge,
    });
  }

  app.setBaseViewsDir(join(WORKING_DIR, 'views'));
  app.setViewEngine('ejs');

  configSession(app);
  configI18n(app);
  configEjsHelpers(app);

  await app.listen(PORT, LISTEN_ON, () => {
    Logger.log(`Nest listening on http://${LISTEN_ON}:${PORT}`, 'Bootstrap');
  });
}
bootstrap();
