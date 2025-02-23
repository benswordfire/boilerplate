import mysql from 'mysql2/promise';
import pool from '../../../config/database/mysql';
import { TwoFactorAuthToken } from '../types/tokens/TwoFactorAuthToken';
import { EmailVerificationToken } from '../types/tokens/EmailVerificationToken';

// TWO FACTOR AUTHENTICATION TOKEN

export const insertTwoFactorAuthToken = async (userId: string, token: string, expiresAt: Date): Promise<mysql.ResultSetHeader> => {
  try {
    const query = 'INSERT INTO two_factor_auth_tokens (userId, token, expiresAt) VALUES (?, ?, ?)';
  
    const [rows]: [mysql.ResultSetHeader, mysql.FieldPacket[]] = await pool.execute<mysql.ResultSetHeader>(query, [userId, token, expiresAt]);
  
    return rows;
  } catch (error) {
    console.error('Database error during token insertion:', error);
    throw error; 
  }
}

export const findTwoFactorAuthTokenByUserId = async (userId: string): Promise<TwoFactorAuthToken | null> => {
  const query = 'SELECT * FROM two_factor_auth_tokens WHERE userId = ? LIMIT 1';

  const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await pool.execute<mysql.RowDataPacket[]>(query, [userId]);

  const result = rows[0] as TwoFactorAuthToken | null;

  return result ?? null;
}

export const removeTwoFactorAuthToken = async (id: string): Promise<void> => {
  const query = 'DELETE FROM two_factor_auth_tokens WHERE id = ?'

  await pool.execute<mysql.ResultSetHeader>(query, [id]);
}


// EMAIL VERIFICATION TOKEN

export const insertEmailVerificationToken = async (userId: string, token: string, expiresAt: Date): Promise<mysql.ResultSetHeader> => {
  const query = 'INSERT INTO email_verification_tokens (userId, token, expiresAt) VALUES (?, ?, ?)';

  const [rows]: [mysql.ResultSetHeader, mysql.FieldPacket[]] = await pool.execute<mysql.ResultSetHeader>(query, [userId, token, expiresAt]);

  return rows;
}

export const findEmailVerificationTokenByUserId = async (
  userId: string
): Promise<Pick<EmailVerificationToken, 'id'> | null> => {
  try {
    const query = `
    SELECT id 
    FROM email_verification_tokens 
    WHERE userId = ? 
    LIMIT 1`;
  
    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await pool.execute<mysql.RowDataPacket[]>(query, [userId]);

    if (!rows.length) return null;
  
    const result: Pick<EmailVerificationToken, 'id'>  = { id: rows[0].id }
  
    return result;
  } catch (error) {
    console.error('Failed to find email verification token:', error);
    throw new Error('Failed to retrieve verification token');
  }
}

export const findEmailVerificationTokenByEmail = async (email: string): Promise<EmailVerificationToken | null> => {
  const query = 'SELECT * FROM email_verification_tokens WHERE email = ? LIMIT 1';

  const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await pool.execute<mysql.RowDataPacket[]>(query, [email]);

  const result = rows[0] as EmailVerificationToken | null;

  return result ?? null;
}

export const findEmailVerificationTokenByToken = async (token: string): Promise<EmailVerificationToken | null> => {
  const query = 'SELECT * FROM email_verification_tokens WHERE token = ? LIMIT 1';

  const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await pool.execute<mysql.RowDataPacket[]>(query, [token]);

  const result = rows[0] as EmailVerificationToken | null;

  return result ?? null;
}

export const removeEmailVerificationToken = async (id: string): Promise<void> => {
  const query = 'DELETE FROM email_verification_tokens WHERE id = ?'

  await pool.execute<mysql.ResultSetHeader>(query, [id]);
}