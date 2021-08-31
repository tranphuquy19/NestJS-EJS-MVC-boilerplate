import { Post, Res, UploadedFile } from '@nestjs/common';
import { ApiV1Controller, FileTypes, Uploader } from '@shared';
import { Response } from 'express';

@ApiV1Controller('uploader')
export class FileUploaderController {
    @Post()
    @Uploader('file', {
        allowedFileTypes: [FileTypes.IMAGE, FileTypes.AUDIO, FileTypes.VIDEO],
        originalName: false,
        maxFileSize: '1 GiB',
        fileName: (file) => `${file.originalname}-${Date.now()}`,
        overwrite: true,
        destination: './public/uploads',
    })
    uploaded(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        return res.json(file);
    }
}
