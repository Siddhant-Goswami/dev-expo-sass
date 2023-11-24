import { URLs } from '@/lib/constants';
import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <h1>Page</h1>

      <Link href={URLs.signIn}>Sign in</Link>
    </div>
  );
}
