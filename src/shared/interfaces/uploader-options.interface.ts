import { FileTypes } from '@shared';

export interface UploaderOptions {
    storagePath?: string;
    allowFileTypes?: FileTypes[];
    allowFileExtensions?: string[];
    rawFileName?: boolean;
    maxFileSize?: number | string;
    uniqueFileName?: string;
}