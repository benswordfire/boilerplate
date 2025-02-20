import 'dotenv/config';
import { S3Client } from '@aws-sdk/client-s3';

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_KEY;

if (!bucketName || !bucketRegion || !accessKey || !secretKey) {
  throw new Error('Missing AWS configuration in environment variables');
}

export const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: bucketRegion,
});
