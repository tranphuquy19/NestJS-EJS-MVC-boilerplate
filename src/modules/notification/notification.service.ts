import { apiHost, email, privateVapidKey, publicVapidKey } from '@config';
import { RedisService } from '@redis/redis.service';
import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import webPush from 'web-push';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);
    private readonly prefix = 'subs';

    constructor(private readonly redisService: RedisService) {
        this.setupWebPush();
    }

    subscribe(req: Request): void {
        const subscription = req.body;
        this.redisService.setObjectByKey(this.prefix + '-' + uuidv4(), subscription);

        webPush
            .sendNotification(
                subscription,
                JSON.stringify({
                    title: 'subscribe notification successfully',
                    icon: `${apiHost}/cat.png`,
                }),
            )
            .catch((err) => this.logger.error(err));
    }

    setupWebPush(): void {
        webPush.setVapidDetails(`mailto:${email}`, publicVapidKey, privateVapidKey);
    }

    async fireNotification(): Promise<void> {
        const keys = await this.redisService.getAllKeyWithPattern(`${this.prefix}*`);
        const subscriptionPromises = keys.map((key) =>
            this.redisService.getObjectByKey<webPush.PushSubscription>(key),
        );
        const subscriptions = await Promise.all(subscriptionPromises);

        subscriptions.forEach((subscription) => {
            webPush
                .sendNotification(
                    subscription,
                    JSON.stringify({
                        title: 'Test notification',
                        icon: `${apiHost}/cat.png`,
                        body: 'Meo meo',
                        vibrate: [300, 100, 400],
                    }),
                )
                .catch((err) => this.logger.log(err));
        });
    }
}
