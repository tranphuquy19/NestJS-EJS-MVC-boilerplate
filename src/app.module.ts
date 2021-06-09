import { roles } from '@/app.roles';
import { AuthModule } from '@auth/auth.module';
import { FileUploaderModule } from '@file-uploader/file-uploader.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
