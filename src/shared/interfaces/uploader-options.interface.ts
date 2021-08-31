import { FileTypes } from '@shared';

export interface UploaderOptions {
    storagePath?: string;
    allowedFileTypes?: FileTypes[];
    allowedFileExtensions?: string[];
    rawFileName?: boolean;
    maxFileSize?: number | string;
    uniqueFileName?: string;
}
