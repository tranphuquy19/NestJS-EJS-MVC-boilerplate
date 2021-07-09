import { AuthService } from '@auth/services';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { STRATEGY_LOCAL } from '@shared';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, STRATEGY_LOCAL) {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(_username: string, _password: string) {
        const user = await this.authService.validateUser(_username, _password);
        if (!user) {
            throw new UnauthorizedException();
        }

        /* eslint-disable @typescript-eslint/no-unused-vars */
        const { id, username, roles, ..._ } = user; // ignore other fields in session stored
        return { id, username, roles };
    }
}
