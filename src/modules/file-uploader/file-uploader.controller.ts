import { apiUrl } from '@config';
import { Logger, Post, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiV1Controller, FileTypes, Uploader } from '@shared';

@ApiV1Controller('uploader')
export class FileUploaderController {
    private readonly logger = new Logger(FileUploaderController.name);
    @Post()
    @Uploader('file', {
        allowedFileTypes: [FileTypes.IMAGE, FileTypes.AUDIO, FileTypes.VIDEO],
        originalName: false,
        maxFileSize: '1 GiB',
        fileName: 'file',
        overwrite: false,
    })
    uploaded(@UploadedFile() file: Express.Multer.File) {
        return file;
    }
}
