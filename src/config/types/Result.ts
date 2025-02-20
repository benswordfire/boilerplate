import { z } from 'zod'

const ResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  status: z.number(),
  data: z.object({}).optional(),
  authorized: z.boolean().optional(),
  isTwoFactorEnabled: z.enum(['disabled', 'email', 'sms']).optional(),
  verificationSid: z.string().optional()
})

export type Result = z.infer<typeof ResultSchema>;