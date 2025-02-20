import { z } from 'zod'

const FileSchema = z.object({
  originalName: z.string(),
  storedName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  uploadedAt: z.date().optional(),
  userId: z.string(),
  bucket: z.string()
});

export type File = z.infer<typeof FileSchema>;