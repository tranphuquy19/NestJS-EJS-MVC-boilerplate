import { defaultStorageDir } from '@config';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { resolve } from 'path';
import { FileUploaderController } from './file-uploader.controller';
import { FileUploaderService } from './file-uploader.service';

@Module({
    imports: [
        MulterModule.register({
            dest: resolve(defaultStorageDir),
        }),
    ],
    controllers: [FileUploaderController],
    providers: [FileUploaderService],
})
export class FileUploaderModule {}
