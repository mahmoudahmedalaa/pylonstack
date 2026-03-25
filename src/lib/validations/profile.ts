import { z } from 'zod';

export const profileUpdateSchema = z.object({
  display_name: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be at most 50 characters')
    .optional(),
  avatar_url: z.string().url('Must be a valid URL').optional(),
  preferences: z
    .object({
      theme: z.enum(['light', 'dark', 'system']).optional(),
      default_currency: z.enum(['USD', 'EUR', 'GBP']).optional(),
    })
    .optional(),
});

export type ProfileUpdatePayload = z.infer<typeof profileUpdateSchema>;
