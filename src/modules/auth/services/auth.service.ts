import { AppRoles, jwtRefreshTokenExpiration, jwtTokenExpiration } from '@config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReqUser } from '@shared';
import { CreateUserDTO } from '@user/dto';
import { UserService } from '@user/user.service';
import parseDuration from 'parse-duration';
import { LoginInputDTO } from '../dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findByUsername(username);

        if (!!user && (await user.comparePassword(password))) {
            return user;
        }
        return null;
    }

    async jwtLogin(data: LoginInputDTO) {
        const { username, password } = data;
        const user = await this.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        } else return this.getAuthToken(user);
    }

    async jwtRefresh(data: any) {
        const user = await this.userService.findById(data.id, { roles: [AppRoles.ADMIN] });
        if (!user) {
            throw new UnauthorizedException();
        } else return this.getAuthToken(user);
    }

    async jwtRegister(data: CreateUserDTO, reqUser: ReqUser) {
        const user = await this.userService.create(data, reqUser);
        return this.getAuthToken(user);
    }

    getAuthToken(user: any) {
        const subject = { id: user.id };

        const payload = {
            id: user.id,
            username: user.username,
            roles: user.roles,
        };

        return {
            accessToken: this.jwtService.sign(payload, {
                expiresIn: parseDuration(jwtTokenExpiration, 's'),
            }),
            refreshToken: this.jwtService.sign(subject, {
                expiresIn: parseDuration(jwtRefreshTokenExpiration, 's'),
            }),
        }; // authToken
    }
}
