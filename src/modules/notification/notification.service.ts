import { apiHost, email, privateVapidKey, publicVapidKey } from '@config';
import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@redis/redis.service';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import webPush from 'web-push';
import { NotificationFiringDTO } from './dto';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);
    private readonly prefix = 'subs';

    constructor(private readonly redisService: RedisService) {
        this.setupWebPush();
    }

    subscribe(subscription: any, userId: string): void {
        this.redisService.setObjectByKey(`${this.prefix}:${userId}:${uuidv4()}`, subscription);

        webPush
            .sendNotification(
                subscription,
                JSON.stringify({
                    title: 'Subscribe notification successfully',
                    icon: `${apiHost}/cat.png`,
                }),
            )
            .catch((err) => this.logger.error(err));
    }

    setupWebPush(): void {
        webPush.setVapidDetails(`mailto:${email}`, publicVapidKey, privateVapidKey);
    }

    async fireAll(option: NotificationFiringDTO): Promise<any> {
        const keys = await this.redisService.getAllKeyWithPattern(`${this.prefix}*`);
        const subscriptionPromises = keys.map((key) =>
            this.redisService.getObjectByKey<webPush.PushSubscription>(key),
        );
        const subscriptions = await Promise.all(subscriptionPromises);

        subscriptions.forEach((subscription) => {
            webPush
                .sendNotification(subscription, JSON.stringify(option.payload))
                .catch((err) => this.logger.log(err));
        });
        return { status: 'OK' };
    }

    async fireToSpecifiedUsers(option: NotificationFiringDTO): Promise<any> {
        const userTargetKeyPromises = option.userIds.map((userId) =>
            this.redisService.getAllKeyWithPattern(`${this.prefix}:${userId}*`),
        );
        const userTargetKeys = await Promise.all(userTargetKeyPromises);
        const userTargetKeysFlatten = _.flattenDeep(userTargetKeys);

        const subscriptionPromises = userTargetKeysFlatten.map((key) =>
            this.redisService.getObjectByKey<webPush.PushSubscription>(key),
        );
        const subscriptions = await Promise.all(subscriptionPromises);

        subscriptions.map((subscription) => {
            webPush
                .sendNotification(subscription, JSON.stringify(option.payload))
                .catch((err) => this.logger.log(err));
        });

        return { status: 'OK' };
    }
}
