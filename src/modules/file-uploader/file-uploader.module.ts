import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { FileUploaderController } from './file-uploader.controller';
import { FileUploaderService } from './file-uploader.service';

@Module({
    imports: [
        MulterModule.register({
            dest: join(process.cwd(), 'public', 'res'),
        }),
    ],
    controllers: [FileUploaderController],
    providers: [FileUploaderService],
})
export class FileUploaderModule {}
