import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, LocalAuthExceptionFilter, Page, ReqUser, User } from '@shared';
import { UserService } from '../user.service';
import { image, name } from 'faker';

@Controller()
@UseFilters(LocalAuthExceptionFilter)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthenticatedGuard)
    @Get('/profile')
    @Page('profile')
    async getProfile(@User('id') { id }: ReqUser) {
        const user = await this.userService.findById(id);
        const pet = { image: image.cats(400, 200), name: name.firstName() }; // just random something to render at FE
        return { user: { ...user, pet } };
    }
}
