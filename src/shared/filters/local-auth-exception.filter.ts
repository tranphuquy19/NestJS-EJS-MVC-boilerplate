import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    ForbiddenException,
    HttpException,
    UnauthorizedException,
} from '@nestjs/common';
import { ERROR_PAGE, LOGIN_PAGE } from '@shared';
import { Request, Response } from 'express';

interface IRequestFlash extends Request {
    flash: any;
}

@Catch(HttpException)
export class LocalAuthExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<IRequestFlash>();

        if (
            exception instanceof UnauthorizedException ||
            exception instanceof ForbiddenException
        ) {
            request.flash('loginError', 'Please try again!');
            response.redirect(LOGIN_PAGE);
        } else {
            response.redirect(ERROR_PAGE);
        }
    }
}
