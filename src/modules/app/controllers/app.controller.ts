import { Controller, Get, Req, Res, UseFilters } from '@nestjs/common';
import { LocalAuth, LocalAuthExceptionFilter, LOGIN_PAGE, Page } from '@shared';
import { Request, Response } from 'express';

@Controller()
@UseFilters(LocalAuthExceptionFilter)
export class AppController {
    @Get()
    index(@Req() req: Request, @Res() res: Response): void {
        if (!req.user) return res.redirect(LOGIN_PAGE);
        else return res.redirect('/home');
    }

    @LocalAuth()
    @Get('home')
    @Page('home')
    getHome(@Req() req: Request) {
        return { user: req.user };
    }
}
