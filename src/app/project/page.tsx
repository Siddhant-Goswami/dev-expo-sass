import { Button } from '@/components/ui/button';
import GetInTouchModal from '@/components/ui/get-in-touch-modal';
import NavBar from '@/components/ui/navbar';
import Image from 'next/image';

export default function Page() {
  const projectTitle = '3D Cube Network for UX/Ul Design';
  const availableForWork = true;
  const userName = 'Rishabh Gurbani';

  return (
    <>
      <NavBar />
      <div className="mt-8 flex justify-center">
        <main className="flex w-8/12 flex-col justify-center">
          <h1 className="mb-4 w-full text-left text-2xl font-semibold">
            {projectTitle}
          </h1>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                width={250}
                height={250}
                alt=""
                className="w-12 rounded-full"
                src="https://lh3.googleusercontent.com/a/ACg8ocLfbKiBRQohC1aCKjnp_7mEa7LGMSewqNZOVZHVuvjwLNFS=s96-c"
              />
              <div>
                <div className="mb-0.5 text-sm font-semibold">{userName}</div>
                <div className="flex items-center">
                  <div
                    className={
                      'h-2 w-2 ' +
                      (availableForWork ? 'bg-green-500' : 'bg-red-500') +
                      ' mr-2 rounded-full'
                    }
                  ></div>
                  {availableForWork ? (
                    <span className="text-xs text-green-500">
                      Available for work
                    </span>
                  ) : (
                    <span className="text-xs text-red-500">
                      Not available for work
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="icon">
                Like
              </Button>
              <Button variant="outline" className="icon">
                Save
              </Button>
              <GetInTouchModal />
            </div>
          </div>
          <Image
            width={250}
            height={250}
            className="h-500 w-900 rounded-sm"
            src="https://cdn.dribbble.com/userupload/11597547/file/original-0bc15864f71e1fcdfa8152b2379fdb44.jpg"
            alt="3D Cube Network"
          />
        </main>
      </div>
    </>
  );
}
