import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { apiUrl, pLimit, pOrder } from '@config';
import { PaginateParams } from '@shared';

export type PaginateType = Pick<PaginateParams, 'route'>;

export const Paginate = createParamDecorator<PaginateType, ExecutionContext, PaginateParams>(
    ({ route }: PaginateType, ctx: ExecutionContext): PaginateParams => {
        const request = ctx.switchToHttp().getRequest();
        const { page, limit, order } = request.query;
        route = `${apiUrl}/${route}`;
        return {
            page: page || 1,
            limit: limit || pLimit,
            order: order || pOrder,
            route,
        };
    },
);
