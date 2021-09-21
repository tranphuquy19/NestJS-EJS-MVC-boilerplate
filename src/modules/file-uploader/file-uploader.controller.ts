import { IImageQueueData } from '@modules/image-resizer/image-options.interface';
import { InjectQueue } from '@nestjs/bull';
import { Post, Res, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ApiV1Controller, FileTypes, Uploader } from '@shared';
import { Queue } from 'bull';
import { Response } from 'express';
import { extname, parse } from 'path';

@ApiV1Controller('uploader')
export class FileUploaderController {
    constructor(@InjectQueue('image') private readonly imageQueue: Queue) {}

    // upload a single file at once
    @Post('single')
    @Uploader('file', {
        allowedFileTypes: [FileTypes.ALL],
        originalName: false,
        maxFileSize: '1 GiB',
        // file name will be generated automatically if it is not provided
        overwrite: true,
        destination: './public/uploads',
    })
    singleFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        return res.json(file);
    }

    // upload a single file at once but STRICTLY check the file format
    @Post('strict-file-type')
    @Uploader('file', {
        allowedFileTypes: [FileTypes.ALL],
        originalName: false,
        maxFileSize: '1 GiB',
        fileName: (file) =>
            `${parse(file.originalname).name}-${Date.now()}${extname(file.originalname)}`,
        overwrite: true,
        destination: './public/uploads',
        checkMagicNumber: true,
    })
    strictFileType(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        return res.json(file);
    }

    // upload multiple files at once but STRICTLY check the files format
    @Post('strict-files-type')
    @Uploader('files', {
        allowedFileTypes: [FileTypes.ALL],
        originalName: false,
        multiple: true,
        maxFileSize: '1 GiB',
        fileName: (file) =>
            `${parse(file.originalname).name}-${Date.now()}${extname(file.originalname)}`,
        overwrite: true,
        destination: './public/uploads',
        checkMagicNumber: true,
        maxCount: 2,
    })
    strictFilesType(@UploadedFiles() files: Array<Express.Multer.File>, @Res() res: Response) {
        return res.json(files);
    }

    // upload a single files at once but RESTRICT the file format. Only allow IMAGE file in this case
    @Post('avatar')
    @Uploader('file', {
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

    // upload multiple files with single field
    @Post('multiple')
    @Uploader('files', {
        allowedFileTypes: [FileTypes.ALL],
        originalName: false,
        multiple: true,
        maxFileSize: '1 GiB',
        overwrite: true,
        destination: './public/uploads',
        maxCount: 50,
    })
    multipleFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Res() res: Response) {
        return res.json(files);
    }

    // upload multiple image files and reduce the quality of the images
    @Post('images')
    @Uploader('files', {
        allowedFileTypes: [FileTypes.ALL],
        originalName: false,
        multiple: true,
        maxFileSize: '17 MiB',
        overwrite: true,
        destination: './public/uploads',
        maxCount: 50,
    })
    async multipleImageFiles(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Res() res: Response,
    ) {
        const imageQueueData: IImageQueueData = {
            files,
            options: {
                quality: 60,
            },
        };
        const job = await this.imageQueue.add('optimize', imageQueueData);
        return res.json({ jobId: job.id });
    }

    // upload multiple files with multiple fields
    @Post('fields')
    @Uploader(
        [
            { name: 'avatar', maxCount: 1 },
            { name: 'cover-image', maxCount: 1 },
        ],
        {
            allowedFileTypes: [FileTypes.ALL],
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
