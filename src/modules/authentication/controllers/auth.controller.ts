import { Request, Response } from 'express';
import { forgotPassword, getCurrentUser, loginUser, registerUser, updateUser, verifyEmail, resetPassword } from '../services/auth.service';
import { LoginFormData } from '../types';
import { RegisterFormSchema } from '../types/RegisterFormSchema';
import { z } from 'zod';
import { User } from '../types/User';
import bcrypt from 'bcryptjs';
import { pool } from '../../../config/database/redis';
import { findUserByEmail } from '../models/auth.models';

export const register = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const formData = RegisterFormSchema.parse(request.body);
    const result = await registerUser(formData);

    response
    .status(result.status)
    .json({ success: result.success, message: result.message });

  } catch (error) {
    console.error(error);
    
    if (error instanceof z.ZodError) {
      response.status(400).json({
        success: false,
        message: error.errors.map(e => e.message).join(', ')
      });
      return;
    }

    
    response.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

export const verification = async (
  request: Request,
  response: Response
): Promise<void> => {

  try {
    const { token } = request.body
    const result = await verifyEmail(token)

    if (!result.success) {
      response
        .status(result.status)
        .json({ success: false, message: result.message });
      return;
    }

    if (result.success) {
      response
        .status(result.status)
        .json({ success: true, message: result.message, authorized: result.authorized });
    }
  } catch (error) {
    console.log(error);
  }
};

export const login = async (
  request: Request,
  response: Response
): Promise<void> => {

  try {
    const formData: LoginFormData = {
      ...request.body,
      session: request.session
    };
    const result = await loginUser(formData);

    if(!result.success && result.message === 'twoFactorIsRequired') {
      response
        .status(result.status)
        .json({ twoFactorRequired: true, twoFactorAuthType: result.isTwoFactorEnabled })
      return;
    }

    if (!result.success) {
      response
        .status(result.status)
        .json({ success: false, message: result.message });
      return;
    }

    if (result.success) {
      response
        .status(result.status)
        .json({ success: true, message: result.message, authorized: result.authorized });
    }
  } catch (error) {
    console.log(error);
  }
};

export const update = async (
  request: Request,
  response: Response
): Promise<void> => {
  console.log('UPDATE:', request.body)
  try {
    const userId = request.session.user?.userId;
    if (!userId) {
      response
        .status(401)
        .json({ error: 'Unauthorized' });
      return;
    }

    const { firstName, lastName, username, email, phoneNumber, isTwoFactorEnabled, password, } = request.body;
    const updateData: Partial<User> = { firstName, lastName, username, email, phoneNumber, isTwoFactorEnabled };

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      updateData.passwordHash = passwordHash;
    }

    console.log('UPDATE2:', updateData)

    const result = await updateUser(userId, updateData);
    console.log('UPDATE RESULT:', result)
    if (result.success) {
      response
        .status(result.status)
        .json({ success: true, message: result.message });
    }
  } catch (error) {
    console.log(error);
  }
}

export const logout = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const sessionID = request.sessionID as string;

    await pool.del(`session:${sessionID}`);

    request.session.destroy((error) => {
      if (error) {
        console.error('Failed to destroy express session:', error);
        return response
          .status(500)
          .json({ message: 'Login failed' });
      }
    });

    response.clearCookie('kuki', { path: '/' });

    return response.redirect('/login');
  } catch (error) {
    console.error('Error during logout:', error);

    response
      .status(500)
      .json({ message: 'Internal server error during logout.' });
  }
};

export const forgot = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { email } = request.body as { email: string };
    const result = await forgotPassword(email);

    response.status(result.status).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const reset = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { token, password, confirmPassword } = request.body as { token: string, password: string, confirmPassword: string };

    if (password !== confirmPassword) {
      response.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await resetPassword(passwordHash, token);

    response.status(result.status).json({
      success: result.success,
      message: result.message,
    });


  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


export const currentUser = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const userId = request.session.user?.userId as string;
    const result = await getCurrentUser(userId);

    response.status(result.status).json({
      success: result.success,
      data: result.data
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

