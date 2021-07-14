import { Body, Controller, Post } from '@nestjs/common';
import { JwtRefreshAuth, ReqUser, User } from '@shared';
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

    @Post('register')
    async register(@Body() data: CreateUserDTO) {
        return await this.authService.jwtRegister(data);
    }
}
