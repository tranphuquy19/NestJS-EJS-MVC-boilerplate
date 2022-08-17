import { randomInt } from 'crypto';
import { Request } from 'express';
import url from 'url';

import { apiUrls } from '@config';

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
    const _url = fullUrl(req);
    for (const _apiUrl of apiUrls) {
        if (_url.startsWith(_apiUrl)) return true;
    }
    return false;
}

/**
 * Generate a random string, default length is 10
 * @param length length of the string
 * @returns
 */
export function randomString(length = 10): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const lastIndex = characters.length - 1;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(randomInt(0, lastIndex));
    }
    return result;
}
