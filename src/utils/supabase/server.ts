import { env } from '@/env';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type cookies } from 'next/headers';

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // IDK WHY but I just copied the docs: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/utils/supabase/server.ts
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // IDK WHY but I just copied the docs: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/utils/supabase/server.ts
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
