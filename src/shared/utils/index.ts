import { apiUrls } from '@config';
import { Request } from 'express';
import url from 'url';

/**
 * Get the full URL in Express
 * @param req ExpressJS request object
 * @returns full request URL
 */
export function fullUrl(req: Request): string {
    return url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl,
    });
}

/**
 * Check if the request is API request
 * @param url
 */
export function isApiRequest(req: Request): boolean {
    const url = fullUrl(req);
    for (let i = 0; i < apiUrls.length; i++) {
        if (url.startsWith(apiUrls[i])) return true;
    }
    return false;
}
