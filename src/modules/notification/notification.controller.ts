import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post('subscribe')
    subscribe(@Req() req: Request) {
        return this.notificationService.subscribe(req);
    }

    @Get('fire-notification')
    fireNotification(): void {
        return this.notificationService.fireNotification();
    }
}
