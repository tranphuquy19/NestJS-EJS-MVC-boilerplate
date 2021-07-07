import { IsNotEmpty, IsString } from 'class-validator';

export class JwtRefreshTokenDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}
