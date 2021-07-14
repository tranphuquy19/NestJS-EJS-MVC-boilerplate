import { applyDecorators, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '@shared';

export function LocalAuth() {
    return applyDecorators(UseGuards(LocalAuthGuard));
}
