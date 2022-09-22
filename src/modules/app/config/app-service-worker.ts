import { Logger } from '@nestjs/common';

import ejs from 'ejs';
import { watchFile, writeFileSync } from 'fs';
import path from 'path';

import { clientUrl, NODE_ENV, publicVapidKey, WORKING_DIR } from '@config';

export function configServiceWorker(): void {
    const logger = new Logger('Bootstrap');
    const mainScriptPath = path.join(WORKING_DIR, 'views', 'templates', 'main.js.ejs');
    const swScriptPath = path.join(WORKING_DIR, 'views', 'templates', 'sw.js.ejs');

    const renderMainFile = () => {
        ejs.renderFile(mainScriptPath, { publicVapidKey }, (err: Error, str: string) => {
            const mainPath = path.join(WORKING_DIR, 'public', 'main.js');
            writeFileSync(mainPath, str, { flag: 'w', encoding: 'utf8' });

            if (err) {
                logger.error(err.message);
            } else {
                logger.debug('Generated script: ./public/main.js successfully');
            }
        });
    };

    const renderSwFile = () => {
        ejs.renderFile(swScriptPath, { clientUrl }, (err: Error, str: string) => {
            const swPath = path.join(WORKING_DIR, 'public', 'sw.js');
            writeFileSync(swPath, str, { flag: 'w', encoding: 'utf8' });

            if (err) {
                logger.error(err.message);
            } else {
                logger.debug('Generated script: ./public/sw.js successfully');
            }
        });
    };

    renderMainFile();
    renderSwFile();

    if (NODE_ENV !== 'production') {
        watchFile(mainScriptPath, renderMainFile);
        watchFile(swScriptPath, renderSwFile);
    }
}
