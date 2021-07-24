import { extname, parse } from 'path';

export const editFileName = (req, file, callback) => {
    const { name } = parse(file.originalname);
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 10).toString(10))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};
