import { z } from 'zod';

export const RegisterFormSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid e-mail address!' }),
  password: z.string()
  .min(8, 'Password must be at least 8 characters!')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter!')
  .regex(/[0-9]/, 'Must contain at least one number!')
  .regex(/[!@#$%^&*()_+|~\-]/, 'Must contain at least one special character!') 
});

export type RegisterFormData = z.infer<typeof RegisterFormSchema>;