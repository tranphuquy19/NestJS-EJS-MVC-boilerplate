import { apiHost } from '@config';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@redis/redis.service';
import { Job, Queue } from 'bull';
import webPush from 'web-push';
import { NotificationFiringDTO, NotificationProviders } from './dtos';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);
    private readonly prefix = 'subs';

    constructor(
        private readonly redisService: RedisService,
        @InjectQueue('notification') private readonly notificationQueue: Queue,
    ) {}

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

    async fireAll(option: NotificationFiringDTO): Promise<any> {
        let job: Job;
        if (option.provider === NotificationProviders.WEB_PUSH) {
            job = await this.notificationQueue.add('web-push-all', { option });
        } else if (option.provider === NotificationProviders.FIREBASE) {
            option.payload['topic'] = 'allDevices';
            job = await this.notificationQueue.add('fcm-all', { option });
        }
        return { status: 'OK', jobId: job.id };
    }

    async fireToSpecifiedUsers(option: NotificationFiringDTO): Promise<any> {
        let job: Job;
        if (option.provider === NotificationProviders.WEB_PUSH) {
            job = await this.notificationQueue.add('web-push-topic', { option });
        } else if (option.provider === NotificationProviders.FIREBASE) {
            job = await this.notificationQueue.add('fcm-topic', { option });
        }
        return { status: 'OK', jobId: job.id };
    }
}
