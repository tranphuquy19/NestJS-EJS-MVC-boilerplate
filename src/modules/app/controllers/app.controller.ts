import { Controller, Get, Logger, Res, UseFilters, UseInterceptors } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { Response } from 'express';

import {
  LocalAuthExceptionFilter,
  LoggedInAuth,
  LOGIN_PAGE,
  Page,
  PageInterceptor,
  ReqUser,
  User,
} from '@shared';

@Controller()
@UseFilters(LocalAuthExceptionFilter)
@UseInterceptors(PageInterceptor)
@ApiExcludeController()
export class AppController {
  private logger = new Logger(AppController.name);

  @Get()
  index(@User() user: ReqUser, @Res() res: Response): void {
    if (!user) return res.redirect(LOGIN_PAGE);
    else return res.redirect('/home');
  }

  @LoggedInAuth()
  @Get('home')
  @Page('home')
  getHome(@User() user: ReqUser) {
    this.logger.debug(`User ${user.username} has logged in, SESSION_ID: ${user.getSessionId()}`);
    return { user };
  }
}
