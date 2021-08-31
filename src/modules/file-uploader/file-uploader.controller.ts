import { Post, UploadedFile } from '@nestjs/common';
import { ApiV1Controller, FileTypes, Uploader } from '@shared';

@ApiV1Controller('uploader')
export class FileUploaderController {
    @Post()
    @Uploader('file', {
        allowedFileTypes: [FileTypes.IMAGE, FileTypes.AUDIO, FileTypes.VIDEO],
        originalName: false,
        maxFileSize: '1 GiB',
        fileName: 'file',
        overwrite: true,
        destination: './public/uploads',
    })
    uploaded(@UploadedFile() file: Express.Multer.File) {
        return file;
    }
}
