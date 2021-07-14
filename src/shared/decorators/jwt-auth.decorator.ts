import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared';

export function JwtAuth() {
    return applyDecorators(UseGuards(JwtAuthGuard));
}
