import { IsNotEmpty, IsString } from 'class-validator';

export class LoginInputDTO {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
