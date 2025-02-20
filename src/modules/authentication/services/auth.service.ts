import bcrypt, { compare } from 'bcryptjs';
import crypto from 'crypto';
import {
  sendVerificationSMS,
  verificationStatus,
} from '../../../config/notifications/sms';
import { Result } from '../../../config/types/Result';
import {
  sendEmailVerificationEmail,
  sendTwoFactorAuthTokenEmail,
} from '../../notifications/services/email.service';
import {
  findUserByEmail,
  findUserById,
  insertUser,
  refreshUser,
} from '../models/auth.models';
import {
  findEmailVerificationTokenByToken,
  findTwoFactorAuthTokenByUserId,
  removeTwoFactorAuthToken,
} from '../models/token.model';
import { LoginFormData, RegisterFormData } from '../types';
import {
  createEmailVerificationToken,
  createTwoFactorAuthToken,
} from './token.service';
import { User } from '../types/User';

export const registerUser = async (data: RegisterFormData): Promise<Result> => {
  try {
    const { email, password } = data;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return {
        success: false,
        message: 'User already registered!',
        status: 409,
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await insertUser(email, passwordHash);

    const token = await createEmailVerificationToken(email);

    await sendEmailVerificationEmail(email, token);

    return {
      success: true,
      message: 'Success! Check your inbox!',
      status: 201,
    };
  } catch (error) {
    console.error('Registration error:', error);

    return {
      success: false,
      message: 'Internal Server Error',
      status: 500,
    };
  }
};

export const verifyEmail = async (token: string): Promise<Result> => {
  try {
    const existingToken = await findEmailVerificationTokenByToken(token);

    if (!existingToken) {
      return {
        success: false,
        message: 'Missing verification token!',
        status: 400,
      };
    }

    const tokenIsExpired = new Date(existingToken.expiresAt) < new Date();

    if (tokenIsExpired) {
      return {
        success: false,
        message: 'Token is expired!',
        status: 400,
      };
    }

    const user = await findUserByEmail(existingToken.email);

    if (!user) {
      return {
        success: false,
        message: 'Invalid token!',
        status: 400,
      };
    }

    await refreshUser(user.id, { isEmailVerified: new Date() });

    return {
      success: true,
      message: 'Successful verification! Now you can log in!',
      status: 201,
    };
  } catch (error) {
    console.error('Email verification error:', error);

    return {
      success: false,
      message: 'Internal Server Error',
      status: 500,
    };
  }
};

export const loginUser = async (data: LoginFormData): Promise<Result> => {
  try {
    const { email, password, session, twoFactorAuthToken } = data;

    if (twoFactorAuthToken && session.temp) {
      if (session.temp.expiresAt < Date.now()) {
        delete session.temp;
        return {
          success: false,
          message: 'Invalid token',
          status: 401,
        };
      }

      if (session.temp.isTwoFactorEnabled === 'email') {
        const existingTwoFactorAuthToken = await findTwoFactorAuthTokenByUserId(
          session.temp.userId
        );

        if (
          !existingTwoFactorAuthToken ||
          twoFactorAuthToken.length !==
            existingTwoFactorAuthToken.token.length ||
          !crypto.timingSafeEqual(
            Buffer.from(existingTwoFactorAuthToken.token),
            Buffer.from(twoFactorAuthToken)
          ) ||
          new Date(existingTwoFactorAuthToken.expiresAt) < new Date()
        ) {
          return {
            success: false,
            message: 'Invalid token',
            status: 401,
          };
        }

        await removeTwoFactorAuthToken(existingTwoFactorAuthToken.id);
      }

      if (session.temp.isTwoFactorEnabled === 'sms') {
        const status = await verificationStatus(
          session.temp.verificationSid!,
          twoFactorAuthToken
        );

        if (status !== 'approved') {
          return { success: false, message: 'Invalid SMS code', status: 401 };
        }
      }

      const user = await findUserById(session.temp.userId);

      if (user) {
        session.user = {
          userId: user.id,
          email: user.email,
        };

        delete session.temp;

        return {
          success: true,
          message: 'Redirect',
          status: 200,
          authorized: true,
        };
      }
    }

    const user = await findUserByEmail(email);

    if (!user || !(await compare(password, user.passwordHash))) {
      return {
        success: false,
        message: 'Invalid credentials',
        status: 401,
      };
    }

    if (user.isTwoFactorEnabled === 'email') {
      const token = await createTwoFactorAuthToken(user.id);

      await sendTwoFactorAuthTokenEmail(user.email, token);

      session.temp = {
        userId: user.id,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        expiresAt: Date.now() + 5 * 60 * 1000,
      };

      return {
        success: true,
        status: 200,
        message: 'twoFactorIsRequired',
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      };
    }

    if (user.isTwoFactorEnabled === 'sms') {
      const verificationSid = await sendVerificationSMS(user.phoneNumber!);

      session.temp = {
        userId: user.id,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        verificationSid,
        expiresAt: Date.now() + 5 * 60 * 1000,
      };

      return {
        success: true,
        status: 200,
        message: 'twoFactorIsRequired',
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      };
    }

    session.user = {
      userId: user.id,
      email: user.email,
    };

    return {
      success: true,
      message: 'Redirect',
      status: 201,
      authorized: true,
    };
  } catch (error) {
    console.error('Login error:', error);

    return {
      success: false,
      message: 'Internal Server Error',
      status: 500,
    };
  }
};


export const updateUser = async (
  userId: string,
  updateData: Partial<User>
): Promise<Result> => {
  try {
    console.log('SERVICE', updateData)
    if (!userId) {
      return {
        success: false,
        message: 'Unauthorized',
        status: 401,
      };
    }

    const filteredUpdateData: Partial<User> = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== '')
    );
  
    if (Object.keys(filteredUpdateData).length === 0) {
      throw new Error('No valid fields provided for update');
    }
  
    await refreshUser(userId, filteredUpdateData);

    return {
      success: true,
      message: 'User data updated successfully',
      status: 200
    }
  } catch (error) {
    console.error('Failed to update settings:', error);

    return {
      success: false,
      message: 'Internal Server Error',
      status: 500,
    };
  }
}