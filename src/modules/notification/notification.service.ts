import { email, privateVapidKey, publicVapidKey } from '@config';
import { Injectable } from '@nestjs/common';
import webPush from 'web-push';

@Injectable()
export class NotificationService {
    private subscriptions: webPush.PushSubscription[] = [];

    constructor() {
        this.setupWebPush();
        // this.streamNotifications();
    }

    setupWebPush(): void {
        webPush.setVapidDetails(`mailto:${email}`, publicVapidKey, privateVapidKey);
    }
}
