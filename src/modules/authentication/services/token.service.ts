import crypto from 'crypto';
import { removeTwoFactorAuthToken, insertTwoFactorAuthToken, findTwoFactorAuthTokenByUserId, removeEmailVerificationToken, findEmailVerificationTokenByEmail, insertEmailVerificationToken, findEmailVerificationTokenByUserId } from '../models/token.model';

const generateTwoFactorAuthToken = (): string => {
  return crypto.randomInt(100_000, 1_000_000).toString();
}

const generateEmailVerificationToken = (): string => {
  return crypto.randomBytes(36).toString('hex');
}

export const createTwoFactorAuthToken = async(
  userId: string
): Promise<string> => {
  try {
    console.log(userId)
    if (!userId) {
      throw new Error('userId is missing')
    }

    const existingToken = await findTwoFactorAuthTokenByUserId(userId);

    if (existingToken) {
      await removeTwoFactorAuthToken(existingToken.id)
    } 
    
    const token = generateTwoFactorAuthToken();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
  
    const result = await insertTwoFactorAuthToken(userId, token, expiresAt)

    if (result.affectedRows !== 1) {
      throw new Error(
        'Failed to create two factor verification token'
      );
    }

    return token;

  } catch (error) {
    throw new Error ('Failed to create 2FA token')
  }
}

export const createEmailVerificationToken = async(
  userId: string
): Promise<string> => {
  try {
    if (!userId) {
      throw new Error('Email is missing')
    }

    const existingToken = await findEmailVerificationTokenByUserId(userId);

    if (existingToken) {
      await removeEmailVerificationToken(existingToken.id)
    } 
    
    const token = generateEmailVerificationToken();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    const result = await insertEmailVerificationToken(userId, token, expiresAt)

    if (result.affectedRows !== 1) {
      throw new Error(
        'Failed to create email verification token'
      );
    }

    return token;

  } catch (error) {
    console.error(error)
    throw new Error ('Failed to create 2FA token')
  }
}