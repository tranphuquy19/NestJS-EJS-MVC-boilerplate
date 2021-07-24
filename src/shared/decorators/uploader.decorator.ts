import { defaultMaxFileSize } from '@config';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, fileFilter } from '@shared';
import { diskStorage } from 'multer';
import { join } from 'path';
import xbytes from 'xbytes';

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
    allowFileTypes?: FileTypes[];
    rawFileName?: boolean;
    maxFileSize?: number;
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
                limits: {
                    fileSize: options.maxFileSize || xbytes.parseSize(defaultMaxFileSize), // in bytes, fix Denial of Service (DoS)
                },
            }),
        ),
    );
}
