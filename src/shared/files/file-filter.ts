import { HttpException, HttpStatus } from '@nestjs/common';

export const fileFilter = (req: any, file: any, callback: any) => {
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
