import { Logger, Module } from '@nestjs/common';
import { createClient } from 'redis';

import { redisPort, redisUrl } from '@config';
import { RedisService } from './redis.service';

@Module({
    providers: [
        RedisService,
        {
            provide: 'RedisClient',
            useFactory: () => {
                const redisClient = createClient({
                    host: redisUrl,
                    port: redisPort,
                });
                redisClient.on('error', (err) => {
                    Logger.log(
                        `Could not establish a connection with redis. ${err}`,
                        'RedisModule',
                    );
                });
                redisClient.on('connect', () => {
                    Logger.log('Connected to redis successfully', 'RedisModule');
                });
                return redisClient;
            },
        },
    ],
    exports: [RedisService],
})
export class RedisModule {}
