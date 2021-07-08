import { jwtSecretKey } from '@config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy, JwtRefreshStrategy, LocalStrategy } from '@shared';
import { UserModule } from '@user/user.module';
import { JwtAuthController, LocalAuthController } from './controllers';
import { AuthService } from './services';
import { SessionSerializer } from './session.serializer';

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            secret: jwtSecretKey,
            signOptions: {
                algorithm: 'HS256',
            },
        }),
    ],
    controllers: [LocalAuthController, JwtAuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtAuthStrategy,
        JwtRefreshStrategy,
        SessionSerializer,
    ],
})
export class AuthModule {}
