import { defaultStorageDir } from '@config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UploaderOptions } from '@shared';
import { randomString } from '@shared/utils';
import { Request } from 'express';
import { existsSync } from 'fs';
import { extname, join, parse, resolve } from 'path';
import sanitizeFilename from 'sanitize-filename';

type cbFileName = (e: Error | null, updatedFileName: string) => void;

function _validate(fileName: string, options: UploaderOptions, cb: cbFileName): void {
    if (options.overwrite) {
        cb(null, fileName);
    } else {
        const _storageDir = resolve(options.destination || defaultStorageDir);
        const _filePath = join(_storageDir, fileName);

        if (existsSync(_filePath)) {
            cb(
                new HttpException(
                    `File ${fileName} already exists!`,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                ),
                fileName,
            );
        } else {
            cb(null, fileName);
        }
    }
}

export const editFileName = (options: UploaderOptions) => {
    return (req: Request, file: Express.Multer.File, callback: cbFileName) => {
        const fileName = sanitizeFilename(file.originalname);

        const { name } = parse(fileName);
        const fileExtName = extname(fileName);

        if (options.originalName) {
            _validate(fileName, options, callback);
        } else {
            if (options.fileName) {
                if (typeof options.fileName === 'function') {
                    _validate(options.fileName(file, req), options, callback);
                } else {
                    if (extname(options.fileName).length === 0) {
                        _validate(`${options.fileName}${fileExtName}`, options, callback);
                    } else {
                        _validate(options.fileName, options, callback);
                    }
                }
            } else {
                const randomName = randomString();
                _validate(`${name}-${randomName}${fileExtName}`, options, callback);
            }
        }
    };
};
