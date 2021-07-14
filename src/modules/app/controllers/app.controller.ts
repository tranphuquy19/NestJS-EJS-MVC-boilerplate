import { Controller, Get, Res, UseFilters } from '@nestjs/common';
import {
    LocalAuthExceptionFilter,
    LoggedInAuth,
    LOGIN_PAGE,
    Page,
    ReqUser,
    User,
} from '@shared';
import { Response } from 'express';

@Controller()
@UseFilters(LocalAuthExceptionFilter)
export class AppController {
    @Get()
    index(@User() user: ReqUser, @Res() res: Response): void {
        if (!user) return res.redirect(LOGIN_PAGE);
        else return res.redirect('/home');
    }

    @LoggedInAuth()
    @Get('home')
    @Page('home')
    getHome(@User() user: ReqUser) {
        return { user };
    }
}
