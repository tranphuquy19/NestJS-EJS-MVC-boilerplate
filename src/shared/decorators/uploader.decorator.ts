import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, fileFilter } from '@shared';
import { diskStorage } from 'multer';
import { join } from 'path';

export function Uploader(fieldName = 'file') {
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
