import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDTO } from '@modules/user/dtos';
import { JwtAuth, JwtRefreshAuth, ReqUser, User } from '@shared';
import { LoginInputDTO } from '../dtos';
import { AuthService } from '../services';

@Controller('jwt')
@ApiTags('auth')
export class JwtAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginInputDTO) {
    return this.authService.jwtLogin(data);
  }

  @JwtRefreshAuth()
  @Post('refresh')
  refresh(@User() user: ReqUser) {
    return this.authService.jwtRefresh(user);
  }

  @JwtAuth()
  @Post('register')
  register(@Body() data: CreateUserDTO, @User() reqUser: ReqUser) {
    return this.authService.jwtRegister(data, reqUser);
  }
}
