import { Body, Controller, Post } from '@nestjs/common';
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
}
