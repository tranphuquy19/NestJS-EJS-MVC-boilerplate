import { defaultStorageDir } from '@config';
import { UploaderOptions } from '@shared';
import { randomString } from '@shared/utils';
import { existsSync } from 'fs';
import { extname, join, parse, resolve } from 'path';

type cbFileName = (e: Error | null, updatedFileName: string) => void;

function _validate(fileName: string, options: UploaderOptions, cb: cbFileName) {
    if (options.overwrite) {
        cb(null, fileName);
    } else {
        const _storageDir = resolve(options.destination || defaultStorageDir);
        const _filePath = join(_storageDir, fileName);

        if (existsSync(_filePath)) {
            cb(new Error(`File ${fileName} is exists`), fileName);
        } else {
            cb(null, fileName);
        }
    }
}

export const editFileName = (options: UploaderOptions) => {
    return (_, file: Express.Multer.File, callback: cbFileName) => {
        const { name } = parse(file.originalname);
        const fileExtName = extname(file.originalname);

        if (options.originalName) {
            _validate(file.originalname, options, callback);
        } else {
            if (options.fileName) {
                if (typeof options.fileName === 'function') {
                    _validate(options.fileName(file), options, callback);
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
