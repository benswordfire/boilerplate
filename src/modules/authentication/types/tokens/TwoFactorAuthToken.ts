import { z } from 'zod';

const TwoFactorAuthTokenSchema = z.object({
  id: z.string(),
  userId: z.string(),
  token: z.string().min(6).max(6),
  expiresAt: z.date(),
  createdAt: z.date()
});

export type TwoFactorAuthToken = z.infer<typeof TwoFactorAuthTokenSchema>;