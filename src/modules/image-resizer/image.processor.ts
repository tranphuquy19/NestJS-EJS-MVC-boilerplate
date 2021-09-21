import { DoneCallback, Job } from 'bull';
import { join } from 'path';
import sharp from 'sharp';
import { IImageQueueData } from './image-options.interface';

async function imageProcessor(job: Job, doneCallback: DoneCallback) {
    const imageQueueData = job.data as IImageQueueData;

    const { files, options } = imageQueueData;

    const filesPromises = files.map((file) => {
        return sharp(file.path)
            .toFormat(options.format)
            .png({ quality: options.quality })
            .toFile(join(options.storageDir, file.filename));
    });

    const outputs = await Promise.all(filesPromises);

    doneCallback(null, outputs);
}

export default imageProcessor;
