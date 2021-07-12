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
    setObjectByKey(key: string, value: Record<string, any>, expired?: number): Promise<boolean> {
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

    deleteByKey(key: string): Promise<boolean> {
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

    getObjectByKey<T>(key: string): Promise<T> {
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
    setByValue(key: string, value: number | string, expired?: number): Promise<boolean> {
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

    /**
     *
     * @param expired amount time for redis value to be expired( 1 = 60s )
     */
    setUniqueObjectByKey(
        key: string,
        value: Record<string, any>,
        expired?: number,
    ): Promise<boolean> {
        const flatValue: Record<string, any> = flat(value);
        const convertToString = JSON.stringify(flatValue);

        return new Promise<boolean>((res, rej) => {
            this.redisRepository.sadd(key, convertToString, (error) => {
                if (error) {
                    this.logger.error(error);
                    return rej(false);
                }
                if (expired) this.redisRepository.expire(key, expired * 60);
                return res(true);
            });
        });
    }

    getAllMembersOfSetByKey<T>(key: string): Promise<T[]> {
        return new Promise<T[]>((res, rej) => {
            this.redisRepository.smembers(key, (err, members) => {
                if (err) {
                    this.logger.error(err);
                    return rej(null);
                }

                const convertToJson = members.map((data) => flat.unflatten(JSON.parse(data)));
                res(convertToJson as T[]);
            });
        });
    }

    removeMemberOfSet(key: string, value: Record<string, any>): Promise<boolean> {
        const flatValue: Record<string, any> = flat(value);
        const convertToString = JSON.stringify(flatValue);
        return new Promise<boolean>((res, rej) => {
            this.redisRepository.srem(key, convertToString, (err) => {
                if (err) {
                    this.logger.error(err);
                    return rej(false);
                }
                return res(true);
            });
        });
    }
}
