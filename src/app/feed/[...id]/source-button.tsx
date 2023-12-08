'use client';
import { buttonVariants } from '@/components/ui/button';
import AuthwallWrapper from '@/components/ui/sign-up-modal';
import { cn } from '@/utils/cn';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

function SourceCode({ projectId, sourceCodeUrl }: { projectIdsourceCodeUrl: string }) {
  return (
    <AuthwallWrapper
    redirectAfterSignin={URLs.projectPage(projectId.toString())}
  >
      <Link
        className={cn(
          buttonVariants({
            variant: 'ghost',
            className: 'rounded-sm px-3.5',
          }),
        )}
        href={sourceCodeUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubLogoIcon className="md:mr-2" />
        <span className="hidden md:inline-block">View Code</span>
      </Link>
    </AuthwallWrapper>
  );
}

export default SourceCode;
