import { Post, Res, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiV1Controller, FileTypes, Uploader } from '@shared';
import { Response } from 'express';
import { extname, parse } from 'path';

@ApiV1Controller('uploader')
export class FileUploaderController {
    @Post('single')
    @Uploader('file', {
        allowedFileTypes: [FileTypes.IMAGE, FileTypes.VIDEO],
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

    @Post('avatar')
    @Uploader('test', {
        allowedFileTypes: [FileTypes.IMAGE],
        allowedFileExtensions: ['heic'],
        originalName: false,
        maxFileSize: '7 MiB',
        fileName: (file) =>
            `${parse(file.originalname).name}-${Date.now()}${extname(file.originalname)}`,
        overwrite: true,
        destination: './public/uploads',
        maxCount: 1,
    })
    uploadAvatar(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        return res.json(file);
    }

    @Post('multiple')
    @Uploader('files', {
        allowedFileTypes: [FileTypes.VIDEO],
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

    @Post('fields')
    @Uploader(
        [
            { name: 'avatar', maxCount: 1 },
            { name: 'cover-image', maxCount: 1 },
        ],
        {
            allowedFileTypes: [FileTypes.AUDIO],
            fileName: (file) =>
                `${parse(file.originalname).name}-${Date.now()}${extname(file.originalname)}`,
            overwrite: true,
            destination: './public/uploads',
        },
    )
    fileFields(@UploadedFiles() files: Array<Express.Multer.File>, @Res() res: Response) {
        return res.json(files);
    }
}
