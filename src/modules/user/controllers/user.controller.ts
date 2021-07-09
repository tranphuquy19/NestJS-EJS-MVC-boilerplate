import { Controller, Get, Req, UseFilters, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, LocalAuthExceptionFilter, Page } from '@shared';
import { Request } from 'express';
import { UserService } from '../user.service';

@Controller()
@UseFilters(LocalAuthExceptionFilter)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthenticatedGuard)
    @Get('/profile')
    @Page('profile')
    async getProfile(@Req() req: Request) {
        const user = await this.userService.findById(req.user['id']);
        return { user };
    }
}
