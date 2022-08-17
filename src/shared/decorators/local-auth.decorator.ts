import { applyDecorators, UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from '@shared';

/**
 * Guard for local login
 * @returns LocalAuth decorator
 */
export function LocalAuth() {
    return applyDecorators(UseGuards(LocalAuthGuard));
}
