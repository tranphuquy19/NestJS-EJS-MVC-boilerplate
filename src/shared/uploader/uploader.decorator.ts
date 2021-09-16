import { defaultMaxFileSize, defaultStorageDir } from '@config';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
    FileFieldsInterceptor,
    FileInterceptor,
    FilesInterceptor,
} from '@nestjs/platform-express';
import {
    MulterField,
    MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { editFileName, fileFilter, UploaderOptions } from '@shared';
import { diskStorage } from 'multer';
import { resolve } from 'path';
import { parseSize } from 'xbytes';

export function Uploader(fieldName: string | MulterField[], options?: UploaderOptions) {
    let fileSize = parseSize(defaultMaxFileSize);

    if (options) {
        const { maxFileSize } = options;
        if (maxFileSize) {
            if (typeof maxFileSize === 'string') {
                fileSize = parseSize(maxFileSize);
            } else {
                fileSize = maxFileSize;
            }
        }
    }

    const multerOpts: MulterOptions = {
        storage: diskStorage({
            filename: editFileName(options),
            destination: resolve(options.destination || defaultStorageDir),
        }),
        fileFilter: fileFilter(options),
        limits: { fileSize }, // Fix SonarCloud: typescript:S5693
    };

    if (typeof fieldName === 'string') {
        if (options.multiple) {
            const maxCount = options.maxCount || Infinity;
            return applyDecorators(
                UseInterceptors(FilesInterceptor(fieldName, maxCount, multerOpts)),
            );
        } else {
            return applyDecorators(UseInterceptors(FileInterceptor(fieldName, multerOpts)));
        }
    } else {
        return applyDecorators(UseInterceptors(FileFieldsInterceptor(fieldName, multerOpts)));
    }
}
