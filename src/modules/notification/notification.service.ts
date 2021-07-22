import { apiHost, email, privateVapidKey, publicVapidKey } from '@config';
import { FcmService } from '@doracoder/fcm-nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@redis/redis.service';
import _ from 'lodash';
import webPush from 'web-push';
import { NotificationFiringDTO, NotificationProviders } from './dto';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);
    private readonly prefix = 'subs';

    constructor(
        private readonly redisService: RedisService,
        private readonly fcmService: FcmService,
    ) {
        this.setupWebPush();
    }

    subscribe(subscription: any, userId: string): void {
        this.redisService.setUniqueObjectByKey(`${this.prefix}:${userId}`, subscription);

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

    unsubscribe(subscription: any, userId: string): void {
        this.redisService.removeMemberOfSet(`${this.prefix}:${userId}`, subscription);
    }

    setupWebPush(): void {
        webPush.setVapidDetails(`mailto:${email}`, publicVapidKey, privateVapidKey);
    }

    sendNotification(subscriptions: webPush.PushSubscription[], option: NotificationFiringDTO) {
        subscriptions.forEach((subscription) => {
            webPush
                .sendNotification(subscription, JSON.stringify(option.payload))
                .catch((err) => this.logger.log(err));
        });
    }

    async fireAllWebPush(option: NotificationFiringDTO): Promise<any> {
        const keys = await this.redisService.getAllKeyWithPattern(`${this.prefix}*`);
        const subscriptionPromises = keys.map((key) =>
            this.redisService.getAllMembersOfSetByKey<webPush.PushSubscription>(key),
        );
        const subUsers = await Promise.all(subscriptionPromises);
        const subscriptions = _.flattenDeep(subUsers);

        this.sendNotification(subscriptions, option);
    }

    async fireAllFirebase(option: NotificationFiringDTO): Promise<any> {
        const { topic, silent, data, ...firebaseData } = option.payload;

        await this.fcmService.sendToTopic(
            topic,
            {
                data,
                notification: firebaseData,
            },
            silent,
        );
    }

    async fireToSpecifiedUsersWebPush(option: NotificationFiringDTO): Promise<any> {
        const subUsersPromises = option.userIds.map((userId) =>
            this.redisService.getAllMembersOfSetByKey<webPush.PushSubscription>(
                `${this.prefix}:${userId}`,
            ),
        );
        const subUsers = await Promise.all(subUsersPromises);
        const subscriptions = _.flatMapDeep(subUsers);

        this.sendNotification(subscriptions, option);
    }

    async fireToSpecifiedUsersFirebase(option: NotificationFiringDTO): Promise<any> {
        const { silent, data, ...firebaseData } = option.payload;
        await this.fcmService.sendNotification(
            option.deviceTokens,
            {
                data,
                notification: firebaseData,
            },
            silent,
        );
    }

    async fireAll(option: NotificationFiringDTO): Promise<any> {
        if (option.provider === NotificationProviders.WEB_PUSH) {
            await this.fireAllWebPush(option);
        } else if (option.provider === NotificationProviders.FIREBASE) {
            option.payload['topic'] = 'allDevices';
            await this.fireAllFirebase(option);
        }
        return { status: 'OK' };
    }

    async fireToSpecifiedUsers(option: NotificationFiringDTO): Promise<any> {
        if (option.provider === NotificationProviders.WEB_PUSH) {
            await this.fireToSpecifiedUsersWebPush(option);
        } else if (option.provider === NotificationProviders.FIREBASE) {
            await this.fireToSpecifiedUsersFirebase(option);
        }
        return { status: 'OK' };
    }
}
