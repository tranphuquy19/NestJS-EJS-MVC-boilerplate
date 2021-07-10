import { publicVapidKey } from '@config';
import { Logger } from '@nestjs/common';
import ejs from 'ejs';
import { writeFileSync } from 'fs';
import path from 'path';

export function configServiceWorker() {
    const logger = new Logger('Bootstrap');
    const filePath = path.join(
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
    ejs.renderFile(filePath, { publicVapidKey }, (err, str) => {
        const swPath = path.join(__dirname, '..', '..', '..', '..', '..', 'public', 'main.js');
        writeFileSync(swPath, str, { flag: 'w', encoding: 'utf8' });
        logger.log('Updated service worker script');
    });
}
