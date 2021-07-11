const parseDuration = require('parse-duration');

module.exports = {
    'type': process.env.DATABASE_TYPE,
    'host': process.env.DATABASE_HOST,
    'port': process.env.DATABASE_PORT,
    'username': process.env.DATABASE_USERNAME,
    'password': process.env.DATABASE_PASSWORD,
    'database': process.env.DATABASE_NAME,
    'synchronize': true,
    'dropSchema': false,
    'logging': false,
    'cache': process.env.DATABASE_ENABLE_CACHE ? { 'duration': parseDuration(process.env.DATABASE_CACHE_DURATION, 'ms') } : false,
    'entities': [
        './dist/**/*.entity{.ts,.js}',
    ],
    'subscribers': [
        './dist/**/*.subscriber{.ts,.js}',
    ]
};
