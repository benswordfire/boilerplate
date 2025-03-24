import { z } from 'zod';

const PasswordResetTokenSchema = z.object({
  id: z.string(),
  email: z.string(),
  token: z.string().min(6).max(6),
  expiresAt: z.date(),
  createdAt: z.date()
});

export type PasswordResetToken = z.infer<typeof PasswordResetTokenSchema>;