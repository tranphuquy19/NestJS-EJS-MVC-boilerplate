import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqContext = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request;
});
