import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { join, resolve } from 'path';

import { defaultStorageDir } from '@config';
import { FileUploaderController } from './file-uploader.controller';
import { FileUploaderService } from './file-uploader.service';

@Module({
  imports: [
    MulterModule.register({
      dest: resolve(defaultStorageDir),
    }),
    BullModule.registerQueue({
      name: 'image',
      processors: [
        {
          name: 'optimize',
          path: join(__dirname, '..', 'image-resizer', 'image.processor.js'),
        },
      ],
    }),
  ],
  controllers: [FileUploaderController],
  providers: [FileUploaderService],
})
export class FileUploaderModule {}
