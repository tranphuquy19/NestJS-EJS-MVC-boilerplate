import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthenticatedGuard, AuthExceptionFilter, LoginGuard } from './shared';
import { Page } from './shared';

@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {
    @Get('/')
    @Page('login')
    index(@Req() req: Request): { message: string[] } {
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
