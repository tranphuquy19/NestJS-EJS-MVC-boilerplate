export const NODE_ENV = process.env.NODE_ENV;
export const PORT = +process.env.PORT;

export const apiUrl = process.env.API_URL;
export const fullApiUrl = `${apiUrl}/${process.env.API_VERSION}`;

export const enableLogging = !!process.env.ENABLE_LOGGING;
export const logDir = process.env.LOG_DIR;
export const onlyErrorRequests = !!process.env.ONLY_ERROR_REQUESTS;
export const logFormat = process.env.LOG_FORMAT;

export const sessionSecret = process.env.SESSION_SECRET;
export const sessionMaxAge = +process.env.SESSION_MAX_AGE;

export const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
export const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
