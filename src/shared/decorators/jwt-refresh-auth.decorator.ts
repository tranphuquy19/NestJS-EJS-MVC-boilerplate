import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtRefreshGuard } from '@shared';

export function JwtRefreshAuth() {
    return applyDecorators(UseGuards(JwtRefreshGuard));
}
