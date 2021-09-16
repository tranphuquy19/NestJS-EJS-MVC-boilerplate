import { HttpException, HttpStatus } from '@nestjs/common';
import { UploaderOptions } from '@shared';
import { extname } from 'path';
import * as FileExtensions from './file-extensions';

export const fileFilter = (options: UploaderOptions) => {
    const _allowedFileExtensions: string[] = [];

    options.allowedFileTypes?.forEach((fileType: string) => {
        switch (fileType) {
            case 'image':
                _allowedFileExtensions.push(...FileExtensions.IMAGE_EXTENSIONS);
                break;
            case 'video':
                _allowedFileExtensions.push(...FileExtensions.VIDEO_EXTENSIONS);
                break;
            case 'audio':
                _allowedFileExtensions.push(...FileExtensions.AUDIO_EXTENSIONS);
                break;
            case 'document':
                _allowedFileExtensions.push(...FileExtensions.DOCUMENT_EXTENSIONS);
                break;
            case 'archive':
                _allowedFileExtensions.push(...FileExtensions.ARCHIVE_EXTENSIONS);
                break;
            case 'application':
                _allowedFileExtensions.push(...FileExtensions.EXECUTABLE_EXTENSIONS);
                break;
            case 'font':
                _allowedFileExtensions.push(...FileExtensions.FONT_EXTENSIONS);
            case 'all':
                _allowedFileExtensions.push(
                    ...FileExtensions.IMAGE_EXTENSIONS,
                    ...FileExtensions.VIDEO_EXTENSIONS,
                    ...FileExtensions.AUDIO_EXTENSIONS,
                    ...FileExtensions.DOCUMENT_EXTENSIONS,
                    ...FileExtensions.ARCHIVE_EXTENSIONS,
                    ...FileExtensions.EXECUTABLE_EXTENSIONS,
                    ...FileExtensions.FONT_EXTENSIONS,
                );
                break;
        }
    });

    options.allowedFileExtensions?.forEach((extension: string | string[]) => {
        if (Array.isArray(extension)) {
            _allowedFileExtensions.push(...extension);
        } else {
            _allowedFileExtensions.push(extension.toLowerCase());
        }
    });

    const _allowedFileExtensionsSet = new Set(_allowedFileExtensions);

    return (req: any, file: Express.Multer.File, callback: any) => {
        const isAllowed = _allowedFileExtensionsSet.has(
            extname(file.originalname).toLowerCase().substr(1),
        );

        if (!isAllowed) {
            return callback(
                new HttpException(
                    `File upload only supports the following filetypes - ${Array.from(
                        _allowedFileExtensionsSet,
                    ).join(', ')}`,
                    HttpStatus.BAD_REQUEST,
                ),
                false,
            );
        } else {
            callback(null, true);
        }
    };
};
