'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './button';

function GoBack() {
  const router = useRouter();
  return (
    <div className="mb-4 w-fit">
      <Button onClick={() => router.back()} className="p-0" variant="link">
        <ChevronLeft className="mr-2" />
        Go back
      </Button>
    </div>
  );
}

export default GoBack;
