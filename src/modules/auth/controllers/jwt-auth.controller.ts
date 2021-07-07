import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtRefreshGuard } from '@shared';
import { Request } from 'express';
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

    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    async refresh(@Req() req: Request) {
        const authToken = await this.authService.jwtRefresh(req.user);
        return authToken;
    }
}
