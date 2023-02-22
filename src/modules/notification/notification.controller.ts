import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LoggedInAuth, User } from '@shared';
import { NotificationFiringDTO } from './dtos';
import { NotificationService } from './notification.service';

@Controller()
@ApiTags('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @LoggedInAuth()
  @Post('subscribe')
  subscribe(@Body() subscription: any, @User('id') userId: string): void {
    return this.notificationService.subscribe(subscription, userId);
  }

  @LoggedInAuth()
  @Post('unsubscribe')
  unsubscribe(@Body() subscription: any, @User('id') userId: string): void {
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
