import { Body, Controller, Post } from '@nestjs/common';
import { JwtAuth, JwtRefreshAuth, ReqUser, User } from '@shared';
import { CreateUserDTO } from '@user/dto';
import { LoginInputDTO } from '../dto';
import { AuthService } from '../services';

@Controller('jwt')
export class JwtAuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() data: LoginInputDTO) {
        const authToken = this.authService.jwtLogin(data);
        return authToken;
    }

    @JwtRefreshAuth()
    @Post('refresh')
    async refresh(@User() user: ReqUser) {
        return await this.authService.jwtRefresh(user);
    }

    @JwtAuth()
    @Post('register')
    async register(@Body() data: CreateUserDTO, @User() reqUser: ReqUser) {
        return await this.authService.jwtRegister(data, reqUser);
    }
}
