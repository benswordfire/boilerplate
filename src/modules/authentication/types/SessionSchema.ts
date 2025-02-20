import { z } from 'zod';

export const SessionSchema = z.object({
  user: z.object({
    userId: z.string(),
    email: z.string()
  }),
  temp: z.object({
    userId: z.string(),
    isTwoFactorEnabled: z.enum(['disabled', 'email', 'sms']).default('disabled'),
    verificationSid: z.string().optional(),
    expiresAt: z.number()
  }).optional()
});