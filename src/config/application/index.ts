export const NODE_ENV = process.env.NODE_ENV;
export const PORT = +process.env.PORT;

export const apiUrl = process.env.API_URL;
export const fullApiUrl = `${apiUrl}/${process.env.API_VERSION}`;

export const sessionSecret = process.env.SESSION_SECRET;
export const sessionMaxAge = +process.env.SESSION_MAX_AGE;
