import { Get } from '@nestjs/common';
import { ApiVersioningController } from '@shared';

@ApiVersioningController({ versions: ['v2', 'v3'] })
export class ApiV23UserController {
    @Get('users')
    getUsers(): any {
        return { data: 'ok' };
    }
}
