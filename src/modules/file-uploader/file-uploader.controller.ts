import { Post, Res, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiV1Controller, FileTypes, Uploader } from '@shared';
import { Response } from 'express';
import { extname, parse } from 'path';

@ApiV1Controller('uploader')
export class FileUploaderController {
    @Post('single')
    @Uploader('file', {
        allowedFileTypes: [FileTypes.IMAGE, FileTypes.AUDIO, FileTypes.VIDEO],
        originalName: false,
        maxFileSize: '1 GiB',
        fileName: (file) =>
            `${parse(file.originalname).name}-${Date.now()}${extname(file.originalname)}`,
        overwrite: true,
        destination: './public/uploads',
    })
    singleFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        return res.json(file);
    }

    @Post('multiple')
    @Uploader('files', {
        allowedFileTypes: [FileTypes.IMAGE, FileTypes.AUDIO, FileTypes.VIDEO],
        originalName: false,
        multiple: true,
        maxFileSize: '1 GiB',
        fileName: (file) =>
            `${parse(file.originalname).name}-${Date.now()}${extname(file.originalname)}`,
        overwrite: true,
        destination: './public/uploads',
        maxCount: 2,
    })
    multipleFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Res() res: Response) {
        return res.json(files);
    }
}
