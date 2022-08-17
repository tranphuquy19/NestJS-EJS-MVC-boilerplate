import {
    CallHandler,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Logger,
    mixin,
    NestInterceptor,
    Type,
} from '@nestjs/common';

import fileType from 'file-type';
import { createReadStream, promises } from 'fs';
import { extname } from 'path';

import { UploaderOptions } from '@shared';

export function MagicNumberCheckerInterceptor(options: UploaderOptions): Type<NestInterceptor> {
    class MixinInterceptor implements NestInterceptor {
        private logger = new Logger(MagicNumberCheckerInterceptor.name);

        private async isConflictFileType(
            file: Express.Multer.File,
        ): Promise<[boolean, fileType.FileTypeResult]> {
            const stream = createReadStream(file.path);
            const _type = await fileType.fromStream(stream);

            if (
                file.mimetype !== _type.mime ||
                extname(file.originalname.toLowerCase()).substr(1) !== _type.ext
            ) {
                this.logger.debug(`${file.originalname}: ${_type.ext}`);
                return [true, _type];
            } else {
                return [false, _type];
            }
        }

        private async deleteFile(filePath: string): Promise<void> {
            const { unlink } = promises;
            try {
                await unlink(filePath);
            } catch (err) {
                this.logger.error(err);
                throw new HttpException(
                    'File format conflict, bad magic number, internal server error',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }

        async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
            const req = context.switchToHttp().getRequest();

            if (options?.checkMagicNumber) {
                if (options.multiple) {
                    const files: Express.Multer.File[] = req.files;
                    let isConflict: [boolean, fileType.FileTypeResult] = [false, null];

                    for (const file of files) {
                        const _isConflict = await this.isConflictFileType(file);
                        if (_isConflict[0]) {
                            isConflict = _isConflict;
                            break;
                        }
                    }

                    // Delete files and throw error
                    if (isConflict[0]) {
                        files.forEach(async (file: Express.Multer.File) => {
                            await this.deleteFile(file.path);
                        });
                        throw new HttpException(
                            'File format conflict, bad magic number',
                            HttpStatus.CONFLICT,
                        );
                    }
                } else {
                    const file: Express.Multer.File = req.file;
                    const isConflict = await this.isConflictFileType(file);

                    if (isConflict[0]) {
                        await this.deleteFile(file.path);
                        throw new HttpException(
                            `File format conflict, bad magic number`,
                            HttpStatus.CONFLICT,
                        );
                    }
                }
                return next.handle();
            } else {
                return next.handle();
            }
        }
    }

    return mixin(MixinInterceptor);
}
