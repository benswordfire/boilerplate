import { z } from 'zod';

export const RegisterFormSchema = z.object({
  email: z.string().email({ message: 'Email is required!' }),
  password: z.string({ message: 'Password is required! '})
});

export type RegisterFormData = z.infer<typeof RegisterFormSchema>;