import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    ForbiddenException,
    HttpException,
    UnauthorizedException,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { ERROR_PAGE, LOGIN_PAGE } from '@shared';

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
            request.flash('loginError', 'pleaseTryAgain');
            response.redirect(LOGIN_PAGE);
        } else {
            response.redirect(ERROR_PAGE);
        }
    }
}
