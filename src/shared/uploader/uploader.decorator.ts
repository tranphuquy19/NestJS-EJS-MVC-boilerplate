import { defaultMaxFileSize, defaultStorageDir } from '@config';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { editFileName, fileFilter, UploaderOptions } from '@shared';
import { diskStorage } from 'multer';
import { resolve } from 'path';
import { parseSize } from 'xbytes';

export function Uploader(fieldName = 'file', options?: UploaderOptions) {
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

    const storageOptions = diskStorage({
        filename: editFileName(options),
        destination: resolve(options.destination || defaultStorageDir),
    });

    if (options.multiple) {
        const maxCount = options.maxCount || Infinity;
        return applyDecorators(
            UseInterceptors(
                FilesInterceptor(fieldName, maxCount, {
                    storage: storageOptions,
                    fileFilter,
                    limits: { fileSize },
                }),
            ),
        );
    } else {
        return applyDecorators(
            UseInterceptors(
                FileInterceptor(fieldName, {
                    storage: storageOptions,
                    fileFilter,
                    limits: { fileSize }, // in bytes, Notice: Denial of Service (DoS)
                }),
            ),
        );
    }
}
