import { HttpException, HttpStatus } from '@nestjs/common';
import { UploaderOptions } from '@shared';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fileFilter = (options: UploaderOptions) => {
    return (req: any, file: Express.Multer.File, callback: any) => {
        if (
            !file.originalname.match(
                /\.(jpg|jpeg|png|gif|zip|rar|pdf|doc|docx|tiff|raw|eps|ai|psd|xls|xlsx|xps|ppt|pps|ppsx|avi|mp4|mkx|flx|mp3|amr|txt|rtf|odt|tar|7z)$/,
            )
        ) {
            return callback(
                new HttpException(
                    'File exts jpg|jpeg|png|gif|zip|rar|pdf|doc|docx|tiff|raw|eps|ai|psd|xls|xlsx|xps|ppt|pps|ppsx|avi|mp4|mkx|flx|mp3|amr|txt|rtf|odt|tar|7z are allowed!',
                    HttpStatus.BAD_REQUEST,
                ),
                false,
            );
        }
        callback(null, true);
    };
};
