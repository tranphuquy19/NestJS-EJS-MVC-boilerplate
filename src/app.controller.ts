import { Controller, Get, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard, LocalAuthExceptionFilter, Page } from './shared';

@Controller()
@UseFilters(LocalAuthExceptionFilter)
export class AppController {
    @Get('/')
    index(@Req() req: Request, @Res() res: Response): void {
        if (!req.user) return res.redirect('/local/login');
        else return res.redirect('/home');
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/home')
    @Page('home')
    getHome(@Req() req: Request) {
        return { user: req.user };
    }
}
