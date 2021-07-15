import { AuthModule } from '@auth/auth.module';
import { roles } from '@config';
import { FileUploaderModule } from '@file-uploader/file-uploader.module';
import { LocalesModule } from '@locales/locales.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '@notification/notification.module';
import { RedisModule } from '@redis/redis.module';
import { SitemapModule } from '@sitemap/sitemap.module';
import { UserModule } from '@user/user.module';
import { AccessControlModule } from 'nest-access-control';
import { AppController } from './controllers';
import { AppService } from './services';
import { FcmModule } from 'nestjs-fcm';
import path from 'path';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        AccessControlModule.forRoles(roles),
        FcmModule.forRoot({
            firebaseSpecsPath: path.join(__dirname, '../../../firebase.spec.json'),
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
