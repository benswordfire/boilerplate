import { z } from 'zod'

const UserSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  email: z.string().email({ message: 'Email is required!' }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isEmailVerified: z.date(),
  phoneNumber: z.string().optional(),
  isPhoneNumberVerified: z.date().optional(),
  passwordHash: z.string({ message: 'Password is required!' }).min(6, { message: 'Password must be at least 6 characters!' }),
  isTwoFactorEnabled: z.enum(['disabled', 'email', 'sms']).default('disabled'),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type User = z.infer<typeof UserSchema>;