import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared';
import { UseRoles, Role, ACGuard } from 'nest-access-control';

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
