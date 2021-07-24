import { defaultMaxFileSize } from '@config';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, fileFilter } from '@shared';
import { UploaderOptions } from '@shared/interfaces';
import { diskStorage } from 'multer';
import { join } from 'path';
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

    return applyDecorators(
        UseInterceptors(
            FileInterceptor(fieldName, {
                storage: diskStorage({
                    filename: editFileName(options),
                    destination: join(process.cwd(), 'public', 'res'),
                }),
                fileFilter,
                limits: { fileSize }, // in bytes, fix Denial of Service (DoS)
            }),
        ),
    );
}
