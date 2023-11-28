import { z } from 'zod';

export const projectFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Please provide a title for your project.')
    .max(50, 'Title must not exceed 50 characters.'),
  hostedUrl: z.string().url('Please enter a valid URL for the hosted project.'),
  sourceCodeUrl: z.string().url('Please enter a valid source code URL.'),
  youtubeUrl: z.string().url('Please enter a  valid youtube URL.'),
  tags: z
    .array(z.string())
    .min(1, 'Please provide at least one tag for your project.'),
  description: z
    .string()
    .min(20, 'Please provide a description for your project.')
    .max(4000, 'Description must not exceed 4000 characters.'),
});
