import parseDuration from 'parse-duration';
import { ConnectionOptions } from 'typeorm';

import {
    databaseCacheDuration,
    databaseEnableCache,
    databaseHost,
    databaseName,
    databasePassword,
    databasePort,
    databaseType,
    databaseUsername,
} from './postgres-config';

export default {
    type: databaseType,
    host: databaseHost,
    port: databasePort,
    username: databaseUsername,
    password: databasePassword,
    database: databaseName,
    autoLoadEntities: false,
    synchronize: false,
    migrationsRun: false,
    logging: process.env.NODE_ENV !== 'production',
    // ssl: false,
    // extra: {
    //     ssl: {
    //         rejectUnauthorized: false,
    //     },
    // },
    migrations: [`dist/src/migrations/**/*`],
    cache: databaseEnableCache ? { duration: parseDuration(databaseCacheDuration) } : false,
    cli: {
        migrationsDir: 'src/migrations',
    },
    entities: [
        // 'src/modules/**/entities/*.entity.ts',
        'dist/src/modules/**/entities/*.entity.js',
    ],
} as unknown as ConnectionOptions;
