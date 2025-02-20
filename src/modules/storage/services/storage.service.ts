import 'dotenv/config';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../../../config/storage/s3'
import { findFilesByUserId, insertFile, removeFile, verifyFile } from '../models/storage.model';
import { Result } from '../../../config/types/Result';

export const uploadFile = async (
  file: Express.Multer.File,
  userId?: string
): Promise<Result> => {

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${userId}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype
  }

  const data = {
    originalName: file.originalname,
    storedName: params.Key,
    mimeType: file.mimetype,
    size: file.size,
    userId: userId!,
    bucket: process.env.AWS_BUCKET_NAME!
  }

  await s3.send(new PutObjectCommand(params))

  await insertFile(data)

  return {
    success: true,
    message: 'Success! File uploaded!',
    status: 201,
  };
};

export const listFiles = async (
  userId: string
): Promise<Result> => {
  try {
    const files = await findFilesByUserId(userId)
    return {
      success: true,
      message: 'Success! File uploaded',
      status: 201,
      data: files
    };
  } catch (error) {
    console.error('Failed to list files:', error);

    return {
      success: false,
      message: 'Internal Server Error',
      status: 500,
    };
  };
};

export const deleteFileById = async (
  fileId: string,
  userId: string
): Promise<Result> => {
  try {
    const file = await verifyFile(fileId, userId);

    if (!file) {
      return {
        success: false,
        message: 'File not found',
        status: 404
      }
    }

    await s3.send(new DeleteObjectCommand({
      Bucket: file.bucket,
      Key: file.storedName
    }));

    await removeFile(fileId, userId)

    return {
      success: true,
      message: 'Files successfully deleted',
      status: 200
    }

  } catch (error) {
    console.log('Failed to delete file:', error)
    
    return {
      success: false,
      message: 'Internal Server Error',
      status: 500,
    };
  }
}
