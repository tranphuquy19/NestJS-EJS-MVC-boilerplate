import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '@shared';

export function LoggedInAuth() {
    return applyDecorators(UseGuards(AuthenticatedGuard));
}
