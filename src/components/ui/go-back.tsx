'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from './button';

function GoBack({ goBackUrl }: { goBackUrl?: string }) {
  const router = useRouter();
  return (
    <div className="mb-4 w-fit">
      {goBackUrl ? (
        <Link
          href={goBackUrl}
          className={buttonVariants({ variant: 'link', className: 'p-0' })}
        >
          <ChevronLeft />
        </Link>
      ) : (
        <Button onClick={() => router.back()} className="p-0" variant="link">
          <ChevronLeft />
        </Button>
      )}
    </div>
  );
}

export default GoBack;
