import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { map, Observable } from 'rxjs';

@Injectable()
export class PageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const page = context.switchToHttp().getResponse();
    page.locals.page = context.getClass().name;

    const locale = page.locals.locale || 'en';

    return next.handle().pipe(map((data) => ({ ...data, lang: locale })));
  }
}
