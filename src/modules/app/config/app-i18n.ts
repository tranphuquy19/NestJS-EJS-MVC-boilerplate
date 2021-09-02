import { defaultLocale, NODE_ENV, sessionMaxAge } from '@config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { isApiRequest } from '@shared';
import { NextFunction, Request, Response } from 'express';
import I18n from 'i18n';
import parseDuration from 'parse-duration';

I18n.configure({
    locales: ['en', 'vi', 'jp'],
    directory: `./src/i18n/locales`,
    cookie: 'lang',
    defaultLocale: defaultLocale,
    fallbacks: { nl: defaultLocale },
    syncFiles: NODE_ENV === 'development',
    updateFiles: NODE_ENV === 'development',
    autoReload: NODE_ENV === 'development',
    missingKeyFn: (locale, value) => {
        return value;
    },
});

export function i18nMiddleware(req: Request, res: Response, next: NextFunction) {
    // Skip the create cookies with API requests
    if (isApiRequest(req)) {
        next();
    } else {
        //set header
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT');
        res.header('Access-Control-Allow-Headers', '*');

        const lang = req.cookies['lang'] || '';
        if (!lang) {
            I18n.setLocale(defaultLocale);
            res.cookie('lang', defaultLocale, {
                maxAge: parseDuration(sessionMaxAge, 'ms'),
            });
        } else I18n.setLocale(lang);
        next();
    }
}

export function configI18n(app: NestExpressApplication) {
    // handle for multiple language
    app.use(i18nMiddleware);
    app.use(I18n.init);
}
