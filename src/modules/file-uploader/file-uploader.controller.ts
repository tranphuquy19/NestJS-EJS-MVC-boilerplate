import { apiUrl } from '@config';
import { Post, UploadedFiles } from '@nestjs/common';
import { ApiV1Controller, Uploader } from '@shared';

@ApiV1Controller('uploader')
export class FileUploaderController {
    @Post()
    @Uploader()
    uploaded(@UploadedFiles() file: any) {
        return {
            fileUrl: `${apiUrl}/res/${file.filename}`,
            originalName: file.originalname,
        };
    }
}
