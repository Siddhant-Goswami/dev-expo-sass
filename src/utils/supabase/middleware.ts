import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          // IDK WHY but I just copied the docs: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/utils/supabase/server.ts
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // IDK WHY but I just copied the docs: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/utils/supabase/server.ts
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          // IDK WHY but I just copied the docs: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/utils/supabase/server.ts
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          // IDK WHY but I just copied the docs: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/utils/supabase/server.ts
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          response.cookies.set({ name, value: '', ...options });
        },
      },
    },
  );

  return { supabase, response };
};
