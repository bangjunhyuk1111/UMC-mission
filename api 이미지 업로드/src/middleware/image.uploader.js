import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import dotenv from 'dotenv';
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import { createUUID } from './uuid.js';

dotenv.config();

// AWS S3 클라이언트 설정
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

// 확장자 검사 목록
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.gif'];

// multer 설정
export const imageUploader = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      const uploadDirectory = req.query.directory ?? '';
      const extension = path.extname(file.originalname);
      const uuid = createUUID();
      
      if (!allowedExtensions.includes(extension)) {
        return callback(new BaseError(status.WRONG_EXTENSION));
      }
      
      callback(null, `${uploadDirectory}/${uuid}_${file.originalname}`);
    },
    acl: 'public-read-write',
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

// 파일 업로드 함수
const uploadFileToS3 = async (fileKey, filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
    Body: fileStream,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log('File uploaded successfully:', data);
    return data;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw new BaseError(status.INTERNAL_SERVER_ERROR, 'Failed to upload file to S3');
  }
};

export default uploadFileToS3;
