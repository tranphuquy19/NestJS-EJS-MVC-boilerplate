import { jwtSecretKey } from '@config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy, LocalStrategy } from '@shared';
import { UsersModule } from '@users/users.module';
import { JwtAuthController, LocalAuthController } from './controllers';
import { AuthService } from './services';
import { SessionSerializer } from './session.serializer';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: jwtSecretKey,
            signOptions: {
                algorithm: 'HS256',
            },
        }),
    ],
    controllers: [LocalAuthController, JwtAuthController],
    providers: [AuthService, LocalStrategy, JwtAuthStrategy, SessionSerializer],
})
export class AuthModule {}
