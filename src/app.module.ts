import { roles } from '@/app.roles';
import { AuthModule } from '@auth/auth.module';
import { FileUploaderModule } from '@file-uploader/file-uploader.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '@notification/notification.module';
import { RedisModule } from '@redis/redis.module';
import { SitemapModule } from '@sitemap/sitemap.module';
import { UsersModule } from '@users/users.module';
import { AccessControlModule } from 'nest-access-control';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        AccessControlModule.forRoles(roles),
        AuthModule,
        UsersModule,
        FileUploaderModule,
        SitemapModule,
        NotificationModule,
        RedisModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
