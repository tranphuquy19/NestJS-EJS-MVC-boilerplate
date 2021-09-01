import { FileTypes } from '@shared';

type cbFileName = (file: Express.Multer.File) => string;

export interface UploaderOptions {
    destination?: string;
    allowedFileTypes?: FileTypes[];
    allowedFileExtensions?: string[];
    originalName?: boolean;
    maxFileSize?: number | string;
    /** Notice: fileName will be ignored when originalName = true
     *
     * Example: 'file', 'file.jpg' # Allow missing file extension
     */
    fileName?: string | cbFileName;
    /**
     *  Overwrite file if exists or throw error
     */
    overwrite?: boolean;
    multiple?: boolean;
    maxCount?: number;
}
