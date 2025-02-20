import { z } from 'zod';

const EmailVerificationTokenSchema = z.object({
  id: z.string(),
  email: z.string(),
  token: z.string().min(6).max(6),
  expiresAt: z.date(),
  createdAt: z.date()
});

export type EmailVerificationToken = z.infer<typeof EmailVerificationTokenSchema>;