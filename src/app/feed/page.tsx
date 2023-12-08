import AuthwallModal from '@/components/AuthwallModal';
import NewFooter from '@/components/NewFooter';
import ScrollableChips from '@/components/ui/chip';
import { GridFallback } from '@/components/ui/grid-fallback';
import NavBar from '@/components/ui/navbar';
import { Suspense } from 'react';
import Projects from './projects';

type FeedProps = {
  searchParams: {
    filter?: string;
  };
};

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const preferredRegion = 'sin1'; // only executes this page in this region

function Feed({ searchParams }: FeedProps) {
  const filter = searchParams?.filter ?? '';

  return (
    <>
      <NavBar />

      <AuthwallModal />

      <section className="min-h-screen w-full px-5 sm:px-18">
        <div className="mb-6 flex w-full justify-center py-4">
          <ScrollableChips />
        </div>

        <Suspense fallback={<GridFallback count={8} />}>
          <Projects filter={filter} />
        </Suspense>
      </section>
      <NewFooter />
    </>
  );
}

export default Feed;
