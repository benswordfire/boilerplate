import mysql from 'mysql2/promise';
import pool from '../../../config/database/mysql';
import { User } from '../types/User';

export const insertUser = async (
  email: string, 
  passwordHash: string
): Promise<Pick<User, 'id'> | null> => {
  try {
    const query = `
      INSERT INTO users (email, passwordHash)
      VALUES (?, ?)
    `;

    await pool.execute<mysql.ResultSetHeader>(query, [email, passwordHash]);

    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await pool.execute<mysql.RowDataPacket[]>(`SELECT id FROM users WHERE email = ? LIMIT 1`, [email]);

    if (!rows.length) return null;

    const result: Pick<User, 'id'> = { id: rows[0].id };

    return result;
  } catch (error) {
    console.error('Failed to insert user into database', error);
    throw new Error('Failed to retrieve verification token');
  }
};

export const findAllUsers = async (): Promise<User[]> => {
  
  const query = `
    SELECT 
      userId, 
      email,
      isTwoFactorEnabled, 
      isEmailVerified, 
      createdAt
    FROM users
  `;

  const [rows] = await pool.execute<mysql.RowDataPacket[]>(query);
  return rows as User[];
};

export const findUserById = async (userId: string): Promise<User | null> => {
  
  const query = `
    SELECT 
      id,
      username, 
      email,
      firstName,
      lastName,
      isEmailVerified,
      phoneNumber,
      isPhoneNumberVerified, 
      isTwoFactorEnabled, 
      isEmailVerified, 
      createdAt,
      updatedAt
    FROM users 
    WHERE id = ?
  `;

  const [rows] = await pool.execute<mysql.RowDataPacket[]>(query, [userId]);
  return rows.length ? (rows[0] as User) : null;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  
  const normalizedEmail = email.trim().toLowerCase();
  
  const query = `
    SELECT 
      id, 
      email,
      passwordHash,
      isEmailVerified,
      phoneNumber,
      isPhoneNumberVerified, 
      isTwoFactorEnabled, 
      isEmailVerified, 
      createdAt,
      updatedAt
    FROM users 
    WHERE email = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute<mysql.RowDataPacket[]>(query, [normalizedEmail]);
  return rows.length ? (rows[0] as User) : null;
};

export const refreshUser = async (
  userId: string,
  updateFields: Partial<User>
): Promise<mysql.ResultSetHeader> => {

  const fieldsToUpdate = Object.keys(updateFields);
  
  if (fieldsToUpdate.length === 0) {
    throw new Error('No fields provided to update');
  }

  const allowedFields = ['username', 'email', 'firstName', 'lastName', 'isEmailVerified', 'phoneNumber', 'isPhoneNumberVerified', 'passwordHash', 'isTwoFactorEnabled'];
  const validFields = fieldsToUpdate.filter(field => allowedFields.includes(field));

  if (validFields.length === 0) {
    throw new Error('Invalid field(s) provided');
  }

  const setClause = validFields.map(field => `${field} = ?`).join(', ');

  const values = validFields.map(field => updateFields[field as keyof User]);

  values.push(userId);

  const query = `UPDATE users SET ${setClause} WHERE id = ?`;

  const [result]: [mysql.ResultSetHeader, mysql.FieldPacket[]] = await pool.execute<mysql.ResultSetHeader>(
    query,
    values
  );

  return result;
};
