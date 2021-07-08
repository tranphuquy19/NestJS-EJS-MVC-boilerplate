import { apiUrls } from '@config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';
import { description, version } from '../../../../package.json';

/**
 * Application config for development environment
 * @param app
 */
export function devConfig(app: NestExpressApplication) {
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
    SwaggerModule.setup('/docs', app, docs); // Route to http://API_URL:PORT/docs-json to get Swagger json-docs
}
