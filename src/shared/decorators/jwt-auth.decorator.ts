import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ACGuard, Role, UseRoles } from 'nest-access-control';

import { JwtAuthGuard } from '@shared';

/**
 * Guard for verifying token
 * @returns JwtAuth decorator
 */
export function JwtAuth(...roles: Role[]) {
    return applyDecorators(
        UseGuards(JwtAuthGuard, ACGuard),
        UseRoles(...roles),
        ApiBearerAuth(),
    );
}
