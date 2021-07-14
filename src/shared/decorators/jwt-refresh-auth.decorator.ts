import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtRefreshGuard } from '@shared';

/**
 * Guard for refresh token
 * @returns JwtRefreshAuth decorator
 */
export function JwtRefreshAuth() {
    return applyDecorators(UseGuards(JwtRefreshGuard));
}
