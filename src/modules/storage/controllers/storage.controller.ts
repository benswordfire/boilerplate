import { Request, Response } from 'express';
import { deleteFileById, listFiles, uploadFile } from '../services/storage.service';
import { verifyFile } from '../models/storage.model';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../../../config/storage/s3';

export const upload = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    if (!request.file) {
      response.status(400).json({ success: false, message: 'Failed to upload files.'});
      return;
    }

    const result = await uploadFile(request.file, request.session.user?.userId);

    response.status(result.status).json({
      success: result.success,
      message: result.message
    });

  } catch (error) {
    console.error('Upload failed:', error);
    response.status(500).json({ error: 'File upload failed' });
  }
};


export const list = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const userId = request.session.user?.userId;
    if (!userId) {
      response.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const result = await listFiles(userId);
    response.status(result.status).json({
      success: result.success,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Failed to fetch files:', error);
    response.status(500).json({ success: false, error: 'Failed to fetch files' });
  }
};

export const deleteFile = async ( 
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const fileId = request.params.id;
    const userId = request.session.user?.userId!;

    const result = await deleteFileById(fileId, userId);

    response.redirect('/files');
  } catch (error) {
    console.error('Failed to delete file:', error);
    response.status(500).json({ success: false, error: 'Failed to delete file' });
  }
}

export const download = async (
  request: Request,
  response: Response
): Promise<void> => { 
  try {
    const fileId = request.params.id;
    const userId = request.session.user?.userId;

    if (!userId) {
      response.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const file = await verifyFile(fileId, userId);
    if (!file) {
      response.status(404).json({ success: false, message: 'File not found' });
      return; 
    }

    const command = new GetObjectCommand({
      Bucket: file.bucket,
      Key: file.storedName 
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    response.redirect(url);

  } catch (error) {
    console.error('Download failed:', error);
    response.status(500).json({ 
      success: false,
      message: 'Download failed'
    });
  }
};


