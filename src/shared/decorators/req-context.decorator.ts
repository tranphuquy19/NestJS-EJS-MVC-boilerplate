import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqContext = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest();
});
