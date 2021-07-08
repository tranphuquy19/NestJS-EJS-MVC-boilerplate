import { Controller, Get, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, LocalAuthExceptionFilter, Page } from '@shared';
import { Request, Response } from 'express';
import { UserService } from '../user.service';

@Controller()
@UseFilters(LocalAuthExceptionFilter)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthenticatedGuard)
    @Get('/profile')
    @Page('profile')
    async getProfile(@Req() req: Request, @Res() res: Response) {
        const user = await this.userService.findById(req.user['id']);
        return { user };
    }
}
