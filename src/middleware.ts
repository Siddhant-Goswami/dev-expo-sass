import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';
import { URLs } from './lib/constants';

// TODO: protect all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
const publicRoutes: string[] = [
  URLs.home,
  URLs.termsOfService,
  URLs.privacyPolicy,
  URLs.signIn,
  URLs.signUp,
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Redirect to sign in page if not logged in && not public route
  if (!publicRoutes.includes(pathname) && !session) {
    // TODO: redirect to original page after sign in
    return NextResponse.redirect(new URL(URLs.signIn, req.nextUrl));
  }

  return res;
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
