import { NODE_ENV, publicVapidKey } from '@config';
import { Logger } from '@nestjs/common';
import ejs from 'ejs';
import { watchFile, writeFileSync } from 'fs';
import path from 'path';

export function configServiceWorker() {
    const logger = new Logger('Bootstrap');
    const scriptTemplatePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'views',
        'templates',
        'main.js.ejs',
    );

    const renderFile = () => {
        ejs.renderFile(scriptTemplatePath, { publicVapidKey }, (err, str) => {
            const swPath = path.join(
                __dirname,
                '..',
                '..',
                '..',
                '..',
                '..',
                'public',
                'main.js',
            );
            writeFileSync(swPath, str, { flag: 'w', encoding: 'utf8' });
            logger.log('Updated service worker script');
        });
    };

    if (NODE_ENV === 'production') {
        renderFile();
    } else {
        watchFile(scriptTemplatePath, renderFile);
    }
}
