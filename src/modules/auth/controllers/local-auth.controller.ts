import { Controller, Get, Post, Req, Res, UseFilters, UseInterceptors } from '@nestjs/common';
import { LocalAuth, LocalAuthExceptionFilter, Page, PageInterceptor } from '@shared';
import { Request, Response } from 'express';

@Controller('local')
@UseFilters(LocalAuthExceptionFilter)
@UseInterceptors(PageInterceptor)
export class LocalAuthController {
    @LocalAuth()
    @Post('login')
    login(@Res() res: Response) {
        res.redirect('/home');
    }

    @Get('logout')
    logout(@Req() req: Request, @Res() res: Response) {
        req.logout();
        res.redirect('/');
    }

    @Get('/login')
    @Page('login')
    renderLogin(@Req() req: Request): { message: string[] } {
        return { message: req.flash('loginError') };
    }
}
