import { z } from 'zod';
import { SessionSchema } from './SessionSchema';

const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Email is required!' }),
  password: z.string({ message: 'Password is required! '}),
  twoFactorAuthToken: z.string().optional(),
  session: SessionSchema
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;