import { defaultMaxFileSize } from '@config';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, fileFilter } from '@shared';
import { diskStorage } from 'multer';
import { join } from 'path';
import { parseSize } from 'xbytes';

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
    allowFileExtensions?: string[];
    rawFileName?: boolean;
    maxFileSize?: number | string;
}

export function Uploader(fieldName = 'file', options?: UploaderOptions) {
    let fileSize = parseSize(defaultMaxFileSize);
    if (options) {
        const { maxFileSize } = options;
        if (options.maxFileSize) {
            if (typeof maxFileSize === 'string') {
                fileSize = parseSize(maxFileSize);
            } else {
                fileSize = maxFileSize;
            }
        }
    }

    return applyDecorators(
        UseInterceptors(
            FileInterceptor(fieldName, {
                storage: diskStorage({
                    filename: editFileName,
                    destination: join(process.cwd(), 'public', 'res'),
                }),
                fileFilter,
                limits: { fileSize }, // in bytes, fix Denial of Service (DoS)
            }),
        ),
    );
}
