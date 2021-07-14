import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '@shared';

export function LocalAuth() {
    return applyDecorators(UseGuards(AuthenticatedGuard));
}
