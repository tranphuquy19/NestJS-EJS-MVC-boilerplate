import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_JWT_AUTH } from '@shared';

@Injectable()
export class JwtAuthGuard extends AuthGuard(STRATEGY_JWT_AUTH) {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return result;
    }

    handleRequest(err: any, user: any, info: Error) {
        if (err || info) {
            throw err || new HttpException(`${info}`, HttpStatus.UNAUTHORIZED);
        }

        if (!user) return { roles: ['GUEST'] };
        else return user;
    }
}
