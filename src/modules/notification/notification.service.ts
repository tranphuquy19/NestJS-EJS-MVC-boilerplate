import { apiHost, email, privateVapidKey, publicVapidKey } from '@config';
import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import webPush from 'web-push';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    private subscriptions: webPush.PushSubscription[] = [];

    constructor() {
        this.setupWebPush();
    }

    subscribe(req: Request): void {
        const subscription = req.body;
        this.subscriptions.push(subscription);

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

    fireNotification(): void {
        this.subscriptions.forEach((subscription) => {
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
