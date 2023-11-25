import { createClient } from '@/utils/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { URLs } from './lib/constants';

// TODO: protect all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const publicRoutes = [
  URLs.home,
  URLs.termsOfService,
  URLs.privacyPolicy,
  URLs.signIn,
  URLs.signUp,
];

export async function middleware(request: NextRequest) {
  try {
    // This `try/catch` block is only here for the interactive tutorial.
    // Feel free to remove once you have Supabase connected.
    const { supabase, response } = createClient(request);

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    await supabase.auth.getSession();

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
