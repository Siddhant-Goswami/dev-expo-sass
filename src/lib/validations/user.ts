import { z } from 'zod';

export const devApplicationStatusesEnum = [
  'pending',
  'approved',
  'rejected',
] as const;

export const devApplicationStatusesSchema = z.enum(devApplicationStatusesEnum);
export type DevApplicationStatus = z.infer<typeof devApplicationStatusesSchema>;

export const devApplicationSchema = z.object({
  displayName: z.string().min(1).max(300),
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters.')
    .max(300, 'Bio must be less than 300 characters.'),
  websiteUrl: z
    .string()
    .transform((val) => {
      if (!val?.startsWith('https://')) {
        val = 'https://' + val;
      }
      return val;
    })
    .pipe(z.string().url('Please enter a valid Portfolio URL')),

  githubUsername: z
    .string()
    .min(5, 'GitHub Username is required.')
    .max(50, 'GitHub Username must be less than 50 characters.'),
  twitterUsername: z.string().nullable().default(null).optional(),
  linkedInUrl: z
    .string()
    .url('Please enter a valid URL.')
    .nullable()
    .default(null)
    .optional(),
});

export type DevApplicationFormSubmitType = z.infer<typeof devApplicationSchema>;
