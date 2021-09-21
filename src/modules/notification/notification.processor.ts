import { email, privateVapidKey, publicVapidKey } from '@config';
import { FcmService } from '@doracoder/fcm-nestjs';
import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { RedisService } from '@redis/redis.service';
import { Job } from 'bull';
import webPush from 'web-push';
import { NotificationFiringDTO } from './dtos';
import _ from 'lodash';

@Processor('notification')
export class NotificationProcessor {
    private readonly logger = new Logger(NotificationProcessor.name);
    private readonly prefix = 'subs';

    constructor(
        private readonly redisService: RedisService,
        private readonly fcmService: FcmService,
    ) {
        this.setupWebPush();
    }

    setupWebPush(): void {
        webPush.setVapidDetails(`mailto:${email}`, publicVapidKey, privateVapidKey);
    }

    async sendNotification(
        subscriptions: webPush.PushSubscription[],
        option: NotificationFiringDTO,
    ): Promise<webPush.SendResult[]> {
        const promises = subscriptions.map((sub) => {
            return webPush.sendNotification(sub, JSON.stringify(option.payload));
        });

        try {
            return await Promise.all(promises);
        } catch (error) {
            this.logger.error(error);
        }
    }

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.log(
            `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
                job.data,
            )}...`,
        );
    }

    @Process('web-push-all')
    async fireAllWebPush(job: Job): Promise<any> {
        try {
            const option = job.data.option as NotificationFiringDTO;
            const keys = await this.redisService.getAllKeyWithPattern(`${this.prefix}*`);
            const subscriptionPromises = keys.map((key) =>
                this.redisService.getAllMembersOfSetByKey<webPush.PushSubscription>(key),
            );
            const subUsers = await Promise.all(subscriptionPromises);
            const subscriptions = _.flattenDeep(subUsers);

            this.sendNotification(subscriptions, option);
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Process('web-push-topic')
    async fireToSpecifiedUsersWebPush(job: Job): Promise<any> {
        try {
            const option = job.data.option as NotificationFiringDTO;
            const subUsersPromises = option.userIds.map((userId) =>
                this.redisService.getAllMembersOfSetByKey<webPush.PushSubscription>(
                    `${this.prefix}:${userId}`,
                ),
            );
            const subUsers = await Promise.all(subUsersPromises);
            const subscriptions = _.flatMapDeep(subUsers);

            this.sendNotification(subscriptions, option);
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Process('fcm-all')
    async fireAllFirebase(job: Job): Promise<any> {
        const option = job.data.option as NotificationFiringDTO;
        const { topic, silent, data, ...firebaseData } = option.payload;

        try {
            await this.fcmService.sendToTopic(
                topic,
                {
                    data,
                    notification: firebaseData,
                },
                silent,
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    @Process('fcm-topic')
    async fireToSpecifiedUsersFirebase(job: Job): Promise<any> {
        const option = job.data.option as NotificationFiringDTO;
        const { silent, data, ...firebaseData } = option.payload;

        try {
            await this.fcmService.sendNotification(
                option.deviceTokens,
                {
                    data,
                    notification: firebaseData,
                },
                silent,
            );
        } catch (error) {
            this.logger.error(error);
        }
    }
}
