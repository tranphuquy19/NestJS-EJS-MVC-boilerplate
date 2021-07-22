import { NODE_ENV, publicVapidKey, clientUrl } from '@config';
import { Logger } from '@nestjs/common';
import ejs from 'ejs';
import { watchFile, writeFileSync } from 'fs';
import path from 'path';

export function configServiceWorker() {
    const logger = new Logger('Bootstrap');
    const mainScriptPath = path.join(
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
    const swScriptPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'views',
        'templates',
        'sw.js.ejs',
    );

    const renderMainFile = () => {
        ejs.renderFile(mainScriptPath, { publicVapidKey }, (err, str) => {
            const mainPath = path.join(
                __dirname,
                '..',
                '..',
                '..',
                '..',
                '..',
                'public',
                'main.js',
            );
            writeFileSync(mainPath, str, { flag: 'w', encoding: 'utf8' });
            if (err) {
                logger.error(err.message);
            } else {
                logger.log('Updated script: ./public/main.js successfully');
            }
        });
    };

    const renderSwFile = () => {
        ejs.renderFile(swScriptPath, { clientUrl }, (err, str) => {
            const swPath = path.join(__dirname, '..', '..', '..', '..', '..', 'public', 'sw.js');
            writeFileSync(swPath, str, { flag: 'w', encoding: 'utf8' });

            if (err) {
                logger.error(err.message);
            } else {
                logger.log('Updated script: ./public/sw.js successfully');
            }
        });
    };

    if (NODE_ENV === 'production') {
        renderMainFile();
        renderSwFile();
    } else {
        watchFile(mainScriptPath, renderMainFile);
        watchFile(swScriptPath, renderSwFile);
    }
}
