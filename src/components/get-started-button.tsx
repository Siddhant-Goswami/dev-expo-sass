'use client';

import { useAuth } from '@/hooks/user/auth';
import logClientEvent from '@/lib/analytics/posthog/client';
import { URLs } from '@/lib/constants';
import Link from 'next/link';
import ShimmerButton from './magicui/shimmer-button';
import { Button } from './ui/button';
import AuthwallWrapper from './ui/sign-up-modal';

function GetStartedButton() {
  const { userId } = useAuth();
  return userId ? (
    <Link href={URLs.feed}>
      <Button
        onClick={() => {
          logClientEvent('click_get_started_button', {
            userId: userId ?? undefined,
            timestamp: Date.now(),
          });
        }}
        variant="brand"
        className="mt-10 px-6 font-medium"
      >
        Explore Projects
      </Button>
    </Link>
  ) : (
    <AuthwallWrapper>
      <ShimmerButton
        onClick={() => {
          logClientEvent('click_get_started_button', {
            userId: userId ?? undefined,
            timestamp: Date.now(),
          });
        }}
        className="mt-10 px-6 font-medium"
      >
        Get Started Now
      </ShimmerButton>
    </AuthwallWrapper>
  );
}

export default GetStartedButton;
