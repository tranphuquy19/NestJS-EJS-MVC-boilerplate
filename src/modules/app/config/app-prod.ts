import {
    apiUrl,
    clientUrl,
    enableLogging,
    logDir,
    logFormat,
    onlyErrorRequests,
    WORKING_DIR,
} from '@config';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path, { dirname, isAbsolute, join } from 'path';

/**
 * Application config for production environment
 * @param app
 */
export function prodConfig(app: NestExpressApplication) {
    app.use(helmet());
    app.use(compression());
    app.enableCors({
        origin: [apiUrl, clientUrl],
        credentials: true,
    });

    if (enableLogging) {
        const logFile = isAbsolute(logDir)
            ? path.join(logDir, 'access.log')
            : join(WORKING_DIR, 'logs', 'access.log');

        // create log directory if it doesn't exist
        const logFileDir = dirname(logFile);
        if (!existsSync(logFileDir)) {
            mkdirSync(logFileDir, { recursive: true });
        }

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
