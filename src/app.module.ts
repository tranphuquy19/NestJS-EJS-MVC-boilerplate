import { roles } from '@/app.roles';
import { AuthModule } from '@auth/auth.module';
import { FileUploaderModule } from '@file-uploader/file-uploader.module';
import { LocalesModule } from '@locales/locales.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '@notification/notification.module';
import { RedisModule } from '@redis/redis.module';
import { SitemapModule } from '@sitemap/sitemap.module';
import { UserModule } from '@user/user.module';
import { AccessControlModule } from 'nest-access-control';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        AccessControlModule.forRoles(roles),
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
