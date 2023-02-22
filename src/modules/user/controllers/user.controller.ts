import { Controller, Get, UseFilters, UseInterceptors } from '@nestjs/common';

import { faker } from '@faker-js/faker';

import {
  LocalAuthExceptionFilter,
  LoggedInAuth,
  Page,
  PageInterceptor,
  ReqUser,
  User,
} from '@shared';
import { UserService } from '../services/user.service';

@Controller()
@UseFilters(LocalAuthExceptionFilter)
@UseInterceptors(PageInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @LoggedInAuth()
  @Get('/profile')
  @Page('profile')
  async getProfile(@User() reqUser: ReqUser) {
    const user = await this.userService.findById(reqUser.id, reqUser);
    const { image, name } = faker;
    const pet = { image: image.cats(400, 200), name: name.firstName() }; // just random something to render at FE
    return { user: { ...user, pet } };
  }
}
