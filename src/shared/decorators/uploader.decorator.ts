import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, fileFilter } from '@shared';
import { diskStorage } from 'multer';
import { join } from 'path';

export enum FileTypes {
    ALL = 'all',
    APPLICATION = 'application',
    AUDIO = 'audio',
    FONT = 'font',
    IMAGE = 'image',
    MODEL = 'model',
    TEXT = 'text',
    VIDEO = 'video',
}

export interface UploaderOptions {
    storagePath?: string;
    fileTypes?: FileTypes[];
}

export function Uploader(fieldName = 'file', options?: UploaderOptions) {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor(fieldName, {
                storage: diskStorage({
                    filename: editFileName,
                    destination: join(process.cwd(), 'public', 'res'),
                }),
                fileFilter,
            }),
        ),
    );
}
