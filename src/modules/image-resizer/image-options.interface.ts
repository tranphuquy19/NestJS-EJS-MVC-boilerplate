import { AvailableFormatInfo, FormatEnum } from 'sharp';

export interface IImageOptions {
    quality: number;
    storageDir: string;
    format: keyof FormatEnum | AvailableFormatInfo;
    // replace if exists
    replace: boolean;
}

export interface IImageQueueData {
    files: Express.Multer.File[];
    options: IImageOptions;
}
