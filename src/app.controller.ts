import { Controller, Get, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard, AuthExceptionFilter, LoginGuard, Page } from './shared';

@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {
    @Get('/')
    index(@Req() req: Request, @Res() res: Response): void {
        if (!req.user) return res.redirect('/login');
        else return res.redirect('/home');
    }

    @Get('/login')
    @Page('login')
    _login(@Req() req: Request): { message: string[] } {
        return { message: req.flash('loginError') };
    }

    @UseGuards(LoginGuard)
    @Post('/login')
    login(@Res() res: Response) {
        res.redirect('/home');
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/home')
    @Page('home')
    getHome(@Req() req: Request) {
        return { user: req.user };
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/profile')
    @Page('profile')
    getProfile(@Req() req: Request) {
        return { user: req.user };
    }

    @Get('/logout')
    logout(@Req() req: Request, @Res() res: Response) {
        req.logout();
        res.redirect('/');
    }
}
