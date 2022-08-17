import { Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiVersioningController } from '@shared';

@ApiVersioningController({ versions: ['v2', 'v3'] })
@ApiTags('test')
export class ApiV23UserController {
    @Get('users')
    getUsers(): any {
        return { data: 'ok' };
    }
}
