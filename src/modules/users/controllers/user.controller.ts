import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, Page } from '@shared';
import { Request } from 'express';

@Controller()
export class UserController {
    @UseGuards(AuthenticatedGuard)
    @Get('/profile')
    @Page('profile')
    getProfile(@Req() req: Request) {
        return { user: req.user };
    }
}
