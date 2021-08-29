import { AuthModule } from '@auth/auth.module';
import { roles, WORKING_DIR } from '@config';
import { FcmModule } from '@doracoder/fcm-nestjs';
import { FileUploaderModule } from '@file-uploader/file-uploader.module';
import { LocalesModule } from '@locales/locales.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '@notification/notification.module';
import { RedisModule } from '@redis/redis.module';
import { SitemapModule } from '@sitemap/sitemap.module';
import { UserModule } from '@user/user.module';
import { AccessControlModule } from 'nest-access-control';
import path from 'path';
import { AppController } from './controllers';
import { AppService } from './services';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        AccessControlModule.forRoles(roles),
        FcmModule.forRoot({
            firebaseSpecsPath: path.join(WORKING_DIR, 'firebase.spec.json'),
        }),
        AuthModule,
        UserModule,
        FileUploaderModule,
        SitemapModule,
        NotificationModule,
        RedisModule,
        LocalesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
