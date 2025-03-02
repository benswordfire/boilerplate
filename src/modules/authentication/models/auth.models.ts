import mysql from 'mysql2/promise';
import pool from '../../../config/database/mysql';
import { logger } from '../../../config/logger/logger';
import { User } from '../types/User';

export const insertUser = async (
  email: string, 
  passwordHash: string
): Promise<Pick<User, 'id'> | null> => {
  logger.debug(`Attempting to insert user to DB with email: ${email}`)
  try {
    const query = `
      INSERT INTO users 
      (email, passwordHash)
      VALUES (?, ?)
    `;

    await pool.execute<mysql.ResultSetHeader>(query, [email, passwordHash]);

    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await pool.execute<mysql.RowDataPacket[]>(`SELECT id FROM users WHERE email = ? LIMIT 1`, [email]);

    if (!rows.length) return null;

    const result: Pick<User, 'id'> = { id: rows[0].id };
    
    logger.info(`User insterted to DB with id: ${result.id}`);
    
    return result;
  } catch (error) {
    logger.error(`Failed to insert user to database with email: ${email}`, error)
    throw new Error('Failed to create user in database');
  }
};

export const findUserById = async (
  userId: string
): Promise<User | null> => {
  logger.debug(`Attempting to retrieve user from DB with id: ${userId}`);
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
        createdAt,
        updatedAt
      FROM users 
      WHERE id = ?
    `;
    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await pool.execute<mysql.RowDataPacket[]>(query, [userId]);

    if (!rows.length) {
      logger.debug(`User not found with the id: ${userId}`);
      return null;
    }

    const result: User = rows[0] as User;

    logger.info(`User retrieved with the id: ${userId}`);

    return result;
  } catch (error) {
    logger.error(`Failed to find user with id: ${userId}`, error)
    throw new Error('Failed to retrieve user by id');
  }

};

export const findUserByEmail = async (
  email: string
): Promise<User | null> => {
  logger.debug(`Attempting to retrieve user from DB with email: ${email}`);
  try {
    
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
    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await pool.execute<mysql.RowDataPacket[]>(query, [email]);
  
    if (!rows.length) {
      logger.debug(`User not found with the email: ${email}`);
      return null;
    }

    const result: User = rows[0] as User;

    logger.info(`User retrieved with the email: ${email}`);
  
    return result;
  } catch (error) {
    logger.error(`Failed to find user with email: ${email}`, error)
    throw new Error('Failed to retrieve user by email');
  }
  
};

export const insertGoogleUser = async (
  email: string, 
  googleId: string,
): Promise<Pick<User, 'id'> | null> => {
  logger.debug(`Attempting to insert Google user to DB with email: ${email}`)
  try {
    const query = `
      INSERT INTO users 
      (email, googleId)
      VALUES (?, ?)
    `;

    await pool.execute<mysql.ResultSetHeader>(query, [email, googleId]);

    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await pool.execute<mysql.RowDataPacket[]>(`SELECT id FROM users WHERE email = ? LIMIT 1`, [email]);

    if (!rows.length) return null;

    const result: Pick<User, 'id'> = { id: rows[0].id };
    
    logger.info(`Google user insterted to DB with id: ${result.id}`);
    
    return result;
  } catch (error) {
    logger.error(`Failed to insert Google user to database with email: ${email}`, error)
    throw new Error('Failed to create Google user in database');
  }
};

export const findUserByGoogleId = async (
  googleId: string
): Promise<Pick<User, 'id'> | null>  => {
  logger.debug(`Attempting to retrieve user from DB with google id: ${googleId}`);
  try {
    const query = `
      SELECT id
      FROM users 
      WHERE googleId = ?
      LIMIT 1
    `;
    const [rows]: [mysql.RowDataPacket[], mysql.FieldPacket[]] = await pool.execute<mysql.RowDataPacket[]>(query, [googleId]);
  
    if (!rows.length) {
      logger.debug(`No user found with the provided google id: ${googleId}`);
      return null;
    }

    // If user is found, we can return a simplified result with just the user id or basic information
    const result: User = { id: rows[0].id } as User;  // Only retrieving necessary data (e.g., user id)

    logger.info(`User retrieved with google id: ${googleId}`);
    logger.debug(`HELLO result: ${result}`)
    return result;
  } catch (error) {
    logger.error(`Failed to find user with google id: ${googleId}`, error)
    throw new Error('Failed to retrieve user by google id');
  }
}



export const refreshUser = async (
  userId: string,
  updateFields: Partial<User>
): Promise<mysql.ResultSetHeader> => {
  try {
    const fieldsToUpdate = Object.keys(updateFields);
    
    if (fieldsToUpdate.length === 0) {
      logger.warn('No fields provided for user update');
      throw new Error('No fields provided to update');
    }
  
    const allowedFields = ['username', 'email', 'firstName', 'lastName', 'isEmailVerified', 'phoneNumber', 'isPhoneNumberVerified', 'passwordHash', 'isTwoFactorEnabled'];
    const validFields = fieldsToUpdate.filter(field => allowedFields.includes(field));
  
    if (validFields.length === 0) {
      logger.warn(`Invalid fields provided for update: ${fieldsToUpdate.join(', ')}`);
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
    logger.info(`Updated ${result.affectedRows} fields for user ${userId}`);
    return result;
  } catch (error) {
    logger.error(`Failed to refresh user ${userId}`, error);
    throw new Error('Failed to update user');
  }
};
