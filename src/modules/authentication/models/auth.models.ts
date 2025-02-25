import mysql from 'mysql2/promise';
import pool from '../../../config/database/mysql';
import { logger } from '../../../config/logger/logger';
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
    logger.info(`User with id:${result} insterted to DB`)
    return result;
  } catch (error) {
    logger.error(`Failed to insert user to database with email: ${email}`, error)
    throw new Error('Failed to create user in database');
  }
};

export const findUserById = async (
  userId: string
): Promise<User | null> => {
  try {
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
    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await pool.execute<mysql.RowDataPacket[]>(query, [userId]);

    if (!rows.length) return null;

    const result: User = rows[0] as User;

    return result;
  } catch (error) {
    logger.error(`Failed to find user with id: ${userId}`, error)
    throw new Error('Failed to retrieve user by id');
  }

};

export const findUserByEmail = async (
  email: string
): Promise<User | null> => {
  try {
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
    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await pool.execute<mysql.RowDataPacket[]>(query, [normalizedEmail]);
  
    if (!rows.length) return null;
  
    const result: User = rows[0] as User;
  
    return result;
  } catch (error) {
    logger.error(`Failed to find user with email: ${email}`, error)
    throw new Error('Failed to retrieve user by email');
  }
  
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
