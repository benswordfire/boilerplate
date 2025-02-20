import mysql from 'mysql2/promise';
import pool from '../../../config/database/mysql';
import { File } from '../types/File';

export const insertFile = async (
  data: File
): Promise<mysql.ResultSetHeader> => {
  const query = `INSERT INTO files(originalName, storedName, mimeType, size, userId, bucket) VALUES (?, ?, ?, ?, ?, ?)`;

  const [result] = await pool.execute<mysql.ResultSetHeader>(query, [data.originalName, data.storedName, data.mimeType, data.size, data.userId, data.bucket]);

  return result;
};

export const findFilesByUserId = async (
  userId: string
): Promise<File[]> => {
  const query = `SELECT id, originalName, storedName, mimeType, size, uploadedAt FROM files WHERE userId = ?`;

  const [rows] = await pool.execute<mysql.RowDataPacket[]>(query, [userId]);
  
  return rows as File[];
};

export const verifyFile = async (
  fileId: string,
  userId: string
): Promise<{ storedName: string, bucket: string }> => {
  const query = `SELECT storedName, bucket FROM files WHERE id = ? AND userId = ?`;

  const [rows] = await pool.execute<mysql.RowDataPacket[]>(query, [fileId, userId]);

  return rows[0] as { storedName: string, bucket: string };
};

export const removeFile = async (
  fileId: string,
  userId: string
): Promise<void> => {
  const query = `DELETE FROM files WHERE id = ? AND userId = ?`;
  
  await pool.execute<mysql.ResultSetHeader>(query, [fileId, userId]);
};

