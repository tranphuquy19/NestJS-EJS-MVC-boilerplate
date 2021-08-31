import path from 'path';

// Environment config variables
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = +process.env.PORT || 4000;
export const LISTEN_ON = process.env.LISTEN_ON || '0.0.0.0';
export const WORKING_DIR = path.resolve(__dirname, '../../../../'); // Notice: Pay attention to this variable when restructuring the project

// Application configuration
export const apiUrls = process.env.API_URLS.split('|');
export const apiUrl = apiUrls[0];
export const apiHost = new URL(apiUrl).origin;
export const fullApiUrl = `${apiUrl}/${process.env.API_VERSION}`;
export const clientUrl = process.env.CLIENT_URL;

// Logging (morgan)
export const enableLogging = !!process.env.ENABLE_LOGGING;
export const logDir = process.env.LOG_DIR;
export const onlyErrorRequests = !!process.env.ONLY_ERROR_REQUESTS;
export const logFormat = process.env.LOG_FORMAT;

// Basic auth (Cookies configuration)
export const sessionSecret = process.env.SESSION_SECRET;
export const sessionMaxAge = process.env.SESSION_MAX_AGE;

// i18n
export const defaultLocale = process.env.DEFAULT_LOCALE;

// JSON Web Token
export const jwtSecretKey = process.env.JWT_SECRET_KEY;
export const jwtTokenExpiration = process.env.JWT_TOKEN_EXPIRATION;
export const jwtRefreshTokenExpiration = process.env.JWT_REFRESH_TOKEN_EXPIRATION;

// Web-push
export const email = process.env.EMAIL; // for web-push
export const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
export const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

// Uploader
export const defaultStorageDir = process.env.DEFAULT_STORAGE_DIR;
export const defaultMaxFileSize = process.env.DEFAULT_MAX_FILE_SIZE;
