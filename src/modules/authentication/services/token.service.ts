import crypto from 'crypto';
import { 
  insertTwoFactorAuthToken, 
  findTwoFactorAuthTokenByUserId, 
  removeTwoFactorAuthToken, 
  insertEmailVerificationToken, 
  findEmailVerificationTokenByUserId,
  removeEmailVerificationToken,
  findPasswordResetTokenByEmail,
  removePasswordResetToken,
  insertPasswordResetToken
} from '../models/token.model';

const generateTwoFactorAuthToken = (): string => {
  return crypto.randomInt(100_000, 1_000_000).toString();
}

const generateHexToken = (): string => {
  return crypto.randomBytes(36).toString('hex');
}

export const createTwoFactorAuthToken = async (
  userId: string
): Promise<string> => {
  try {
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

export const createEmailVerificationToken = async (
  userId: string
): Promise<string> => {
  try {
    if (!userId) {
      throw new Error('UserId is missing')
    }

    const existingToken = await findEmailVerificationTokenByUserId(userId);

    if (existingToken) {
      await removeEmailVerificationToken(existingToken.id)
    } 
    
    const token = generateHexToken();
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

export const createPasswordResetToken = async (
  email: string
): Promise<string> => {
  try {
    if (!email) {
      throw new Error('Email is missing')
    }

    const existingToken = await findPasswordResetTokenByEmail(email);

    if (existingToken) {
      if (existingToken.expiresAt > new Date()) {
        throw new Error('A reset link has already been sent. Please check your email.')
      }
      await removePasswordResetToken(existingToken.email);
    }


    const token = generateHexToken();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    const result = await insertPasswordResetToken(email, token, expiresAt)

    if (result.affectedRows !== 1) {
      throw new Error(
        'Failed to create email verification token'
      );
    }

    return token;
  } catch (error) {
    console.error('Failed create password reset token:', error);
    throw new Error ('Failed to create password reset token')
  }
}