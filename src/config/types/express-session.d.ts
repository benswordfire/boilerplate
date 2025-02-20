import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      userId: string
      email: string
    }
    temp?: {
      userId: string;
      isTwoFactorEnabled: 'disabled' | 'email' | 'sms';
      verificationSid: string;
      expiresAt: number;
    };
  }
}

