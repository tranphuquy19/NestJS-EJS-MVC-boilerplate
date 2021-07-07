import { apiUrl } from '@config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';

/**
 * Application config for development environment
 * @param app 
 */
export function devConfig(app: NestExpressApplication) {
    app.enableCors();
    app.use(morgan('short'));
    app.disable('view cache');

    const swaggerBuilder = new DocumentBuilder()
        .setTitle('NestJS EJS MVC Boilerplate')
        .setDescription(require('../package.json').description)
        .addBearerAuth()
        .addServer(apiUrl)
        .setVersion(require('../package.json').version)
        .build();
    const docs = SwaggerModule.createDocument(app, swaggerBuilder);
    SwaggerModule.setup('/docs', app, docs); // Route to http://API_URL:PORT/docs-json to get Swagger json-docs
}
