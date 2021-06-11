import { apiUrl } from '@config';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { SitemapStream, streamToPromise } from 'sitemap';

@Injectable()
export class SitemapService {
    _sitemapXmlCache: any;
    _sitemapTimeoutMs = 3600000; // 1000 * 60 * 60

    async generateSitemap(res: Response) {
        res.set('Content-Type', 'text/xml');
        if (this._sitemapXmlCache) {
            res.send(this._sitemapXmlCache);
            return;
        }

        const smStream = new SitemapStream({
            hostname: apiUrl,
        });

        smStream.write({
            url: '/',
            changefreq: 'daily',
            priority: 1,
        });

        smStream.end();

        streamToPromise(smStream).then((xml) => {
            this._sitemapXmlCache = xml;
            setTimeout(() => {
                this._sitemapXmlCache = null;
            }, this._sitemapTimeoutMs);
            res.send(xml);
        });
    }
}
