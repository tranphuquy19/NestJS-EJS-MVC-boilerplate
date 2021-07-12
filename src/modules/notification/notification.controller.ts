import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, User } from '@shared';
import { NotificationFiringDTO } from './dto';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post('subscribe')
    @UseGuards(AuthenticatedGuard)
    subscribe(@Body() subscription: any, @User('id') userId: string) {
        return this.notificationService.subscribe(subscription, userId);
    }

    @Post('unsubscribe')
    @UseGuards(AuthenticatedGuard)
    unsubscribe(@Body() subscription: any, @User('id') userId: string) {
        return this.notificationService.unsubscribe(subscription, userId);
    }

    @Post('fire-notification')
    fireNotification(@Body() option: NotificationFiringDTO): Promise<void> {
        if (option.type === 'all') {
            return this.notificationService.fireAll(option);
        } else {
            return this.notificationService.fireToSpecifiedUsers(option);
        }
    }
}
