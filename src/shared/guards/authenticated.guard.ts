import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        request.user.getSessionId = () => {
            return request.sessionID;
        };

        return request.isAuthenticated();
    }
}
