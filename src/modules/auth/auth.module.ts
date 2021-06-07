import { Module } from '@nestjs/common';
import { LocalStrategy } from '@shared';
import { UsersModule } from '@users/users.module';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';

@Module({
    imports: [UsersModule],
    providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
