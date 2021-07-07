import { Controller, Get, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { LocalAuthExceptionFilter, LocalAuthGuard, Page } from '@shared';
import { Request, Response } from 'express';

@Controller('local')
@UseFilters(LocalAuthExceptionFilter)
export class LocalAuthController {
    @UseGuards(LocalAuthGuard)
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
