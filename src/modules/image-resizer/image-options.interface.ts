export interface IImageOptions {
    quality?: number;
}

export interface IImageQueueData {
    files: Express.Multer.File[];
    options: IImageOptions;
}
