import { env } from '@/env';

export const URLs = {
  home: '/',
  dashboard: '/dashboard',
  signIn: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  signUp: env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  termsOfService: '/terms',
  privacyPolicy: '/privacy',
} as const;
