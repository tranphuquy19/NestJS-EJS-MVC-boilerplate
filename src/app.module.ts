import { AuthModule } from '@auth/auth.module';
import { FileUploaderModule } from '@file-uploader/file-uploader.module';
import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [AuthModule, UsersModule, FileUploaderModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
