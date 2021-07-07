import { jwtSecretKey } from '@config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { STRATEGY_JWT_AUTH } from '@shared';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, STRATEGY_JWT_AUTH) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecretKey,
            algorithms: ['HS256'],
        });
    }

    async validate(payload: any) {
        return payload;
    }
}
