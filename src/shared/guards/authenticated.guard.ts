import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

type Request = Express.Request & { user: any };

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    if (!request.user) {
      return false;
    }

    request.user.getSessionId = () => {
      return request.sessionID;
    };

    return request.isAuthenticated();
  }
}
