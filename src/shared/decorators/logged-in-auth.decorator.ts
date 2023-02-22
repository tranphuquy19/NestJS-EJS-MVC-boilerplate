import { applyDecorators, UseGuards } from '@nestjs/common';

import { AuthenticatedGuard } from '@shared';

/**
 * Guard for AuthenticatedGuard.
 * @returns LoggedInAuth decorator
 */
export function LoggedInAuth() {
  return applyDecorators(UseGuards(AuthenticatedGuard));
}
