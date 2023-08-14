import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto'
import path from 'path'
import multer from 'multer'


export const storage = new GridFsStorage({
  url: process.env.CONNECTION_STRING + '/' + process.env.DEFAULT_DATABASE,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err: Error | null, buf: Buffer) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

export const upload = multer({ storage });

