import { Inject, Injectable, Logger } from '@nestjs/common';
import flat from 'flat';
import { RedisClient } from 'redis';

@Injectable()
export class RedisService {
    private readonly logger = new Logger(RedisClient.name);

    // Ref: https://github.com/Heaty566/mychess/blob/main/server/src/utils/redis/redis.service.ts
    constructor(@Inject('RedisClient') private readonly redisRepository: RedisClient) {}

    /**
     *
     * @param expired amount time for redis value to be expired( 1 = 60s )
     */
    setObjectByKey(key: string, value: Record<string, any>, expired?: number) {
        const flatValue: Record<string, any> = flat(value);
        const convertToString = JSON.stringify(flatValue);

        return new Promise<boolean>((res, rej) => {
            this.redisRepository.set(key, convertToString, (error) => {
                if (error) {
                    this.logger.error(error);
                    return rej(false);
                }
                if (expired) this.redisRepository.expire(key, expired * 60);
                return res(true);
            });
        });
    }

    /**
     *
     * @param expired amount time for redis value to be expired( 1 = 60s )
     */
    setObjectHashKey(hash: string, key: string, value: Record<string, any>, expired?: number) {
        const flatValue: Record<string, any> = flat(value);
        const convertToString = JSON.stringify(flatValue);

        return new Promise<boolean>((res, rej) => {
            this.redisRepository.hset(hash, key, convertToString, (error) => {
                if (error) {
                    this.logger.error(error);
                    return rej(false);
                }
                if (expired) this.redisRepository.expire(hash, expired * 60);
                return res(true);
            });
        });
    }

    deleteByKey(key: string) {
        return new Promise<boolean>((res, rej) => {
            this.redisRepository.del(key, (error) => {
                if (error) {
                    this.logger.error(error);
                    return rej(false);
                }
                return res(true);
            });
        });
    }

    getObjectByKey<T>(key: string) {
        return new Promise<T>((res, rej) => {
            this.redisRepository.get(key, (err, data) => {
                if (err) {
                    this.logger.error(err);
                    return rej(null);
                }

                const convertToJson = flat.unflatten(JSON.parse(data));
                res(convertToJson as T);
            });
        });
    }

    /**
     *
     * @param expired amount time for redis value to be expired( 1 = 60s )
     */
    setByValue(key: string, value: number | string, expired?: number) {
        return new Promise<boolean>((res, rej) => {
            this.redisRepository.set(key, String(value), (error) => {
                if (error) {
                    this.logger.error(error);
                    return rej(false);
                }
                if (expired) this.redisRepository.expire(key, expired * 60);
                return res(true);
            });
        });
    }

    getByKey(key: string): Promise<string> {
        return new Promise((res, rej) => {
            this.redisRepository.get(key, (err, data) => {
                if (err) {
                    this.logger.error(err);
                    return rej(null);
                }

                res(data);
            });
        });
    }

    getAllKeyWithPattern(pattern: string): Promise<string[]> {
        return new Promise((res, rej) => {
            this.redisRepository.keys(pattern, (err, data) => {
                if (err) {
                    this.logger.error(err);
                    return rej(null);
                }

                res(data);
            });
        });
    }
}
