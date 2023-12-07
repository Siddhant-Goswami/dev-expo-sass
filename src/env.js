import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    RESEND_API_KEY: z.string(),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),

    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
    NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string(),

    NEXT_PUBLIC_APP_URL: z
      .preprocess((str) => process.env.VERCEL_URL ?? str, z.string())
      .transform((val) => {
        if (val?.includes('vercel') && !val?.startsWith('https://')) {
          val = 'https://' + val;
        }

        return val;
      })
      .pipe(z.string().url().optional()),
    NEXT_PUBLIC_POSTHOG_PUBLIC_KEY: z.string(),

    NEXT_PUBLIC_VERCEL_URL: z
      .preprocess((str) => process.env.VERCEL_URL ?? str, z.string().optional())
      .transform((val) => {
        if (val?.includes('vercel') && !val?.startsWith('https://')) {
          val = 'https://' + val;
        }
        return val;
      })
      .pipe(z.string().url().optional()),
    NEXT_PUBLIC_VERCEL_ENV: z
      .enum(['development', 'preview', 'production'])
      .optional(),

    NEXT_PUBLIC_NODE_ENV: z
      .string()
      .optional()
      .transform((val) => val ?? process.env.NODE_ENV)
      .pipe(z.enum(['development', 'test', 'production']).optional()),

    NEXT_PUBLIC_SHOW_DEBUG_CONTROLS: z
      .string()
      .optional()
      .transform((val) => val === 'true')
      .pipe(z.boolean()),

    NEXT_PUBLIC_TAWK_TO_SRC_URL: z.string().url(),

    NEXT_PUBLIC_MICROSOFT_CLARITY_CODE: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // Server
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV, // make it available on the client too
    NODE_ENV: process.env.NODE_ENV,

    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,

    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXT_PUBLIC_SHOW_DEBUG_CONTROLS:
      process.env.NEXT_PUBLIC_SHOW_DEBUG_CONTROLS,
    NEXT_PUBLIC_POSTHOG_PUBLIC_KEY: process.env.NEXT_PUBLIC_POSTHOG_PUBLIC_KEY,

    NEXT_PUBLIC_TAWK_TO_SRC_URL: process.env.NEXT_PUBLIC_TAWK_TO_SRC_URL,

    NEXT_PUBLIC_MICROSOFT_CLARITY_CODE:
      process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_CODE,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
