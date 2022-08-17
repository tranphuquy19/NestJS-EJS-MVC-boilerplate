import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import morgan from 'morgan';

import { apiHost, apiUrls } from '@config';
import { description, version } from '../../../../package.json'; // Notice: the packages.json will be added to dist folder

/**
 * Application config for development environment
 * @param app
 */
export function devConfig(app: NestExpressApplication): void {
    const logger = new Logger('Bootstrap');

    app.enable('trust proxy');
    app.enableCors();
    app.use(morgan('short'));
    app.disable('view cache');

    let swaggerBuilder = new DocumentBuilder()
        .setTitle('NestJS EJS MVC Boilerplate')
        .setDescription(description)
        .addBearerAuth();

    apiUrls.forEach((apiUrl) => {
        swaggerBuilder = swaggerBuilder.addServer(apiUrl);
    });

    swaggerBuilder = swaggerBuilder.setVersion(version);

    const swaggerConfig = swaggerBuilder.build();

    const docs = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/docs', app, docs); // Notice: Route to http://API_URL:PORT/docs-json to get Swagger json-docs
    logger.debug(`Swagger docs: ${apiHost}/docs`);
    logger.debug(`Swagger-JSON file: ${apiHost}/docs-json`);
}
