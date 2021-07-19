import { apiUrl } from '@config';
import { Post, UploadedFiles } from '@nestjs/common';
import { ApiV1Controller, FileTypes, Uploader } from '@shared';

@ApiV1Controller('uploader')
export class FileUploaderController {
    @Post()
    @Uploader('file', {
        fileTypes: [FileTypes.IMAGE, FileTypes.AUDIO, FileTypes.VIDEO],
        rawFileName: true,
    })
    uploaded(@UploadedFiles() file: any) {
        return {
            fileUrl: `${apiUrl}/res/${file.filename}`,
            originalName: file.originalname,
        };
    }
}
