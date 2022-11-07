import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FcmModule } from '@doracoder/fcm-nestjs';
import { AccessControlModule } from 'nest-access-control';
import path from 'path';

import { redisPort, redisUrl, roles, WORKING_DIR } from '@config';
import * as TypeOrmConfig from '@config/databases/ormconfig';

import { AuthModule } from '@auth/auth.module';
import { FileUploaderModule } from '@file-uploader/file-uploader.module';
import { LocalesModule } from '@locales/locales.module';
import { NotificationModule } from '@notification/notification.module';
import { RedisModule } from '@redis/redis.module';
import { SitemapModule } from '@sitemap/sitemap.module';
import { UserModule } from '@user/user.module';

import { AppController } from './controllers';
import { AppService } from './services';

@Module({
    imports: [
        TypeOrmModule.forRoot(TypeOrmConfig.default),
        AccessControlModule.forRoles(roles),
        FcmModule.forRoot({
            firebaseSpecsPath: path.join(WORKING_DIR, 'firebase.spec.json'),
        }),
        BullModule.forRootAsync({
            useFactory: () => ({
                redis: {
                    host: redisUrl,
                    port: redisPort,
                },
            }),
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
