import { Controller, Get, Post, Req, Res, UseFilters, UseInterceptors } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { Request, Response } from 'express';

import { LocalAuth, LocalAuthExceptionFilter, Page, PageInterceptor } from '@shared';
import { FlashErrorDTO } from '../dtos';

@Controller('local')
@UseFilters(LocalAuthExceptionFilter)
@UseInterceptors(PageInterceptor)
@ApiExcludeController()
export class LocalAuthController {
    @LocalAuth()
    @Post('login')
    login(@Res() res: Response) {
        res.redirect('/home');
    }

    @Get('logout')
    logout(@Req() req: Request, @Res() res: Response): void {
        req.logout();
        res.redirect('/');
    }

    @Get('/login')
    @Page('login')
    renderLogin(@Req() req: Request): FlashErrorDTO {
        return { message: req.flash('loginError') };
    }
}
