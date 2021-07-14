import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared';

/**
 * Guard for verifying token
 * @returns JwtAuth decorator
 */
export function JwtAuth() {
    return applyDecorators(UseGuards(JwtAuthGuard));
}
