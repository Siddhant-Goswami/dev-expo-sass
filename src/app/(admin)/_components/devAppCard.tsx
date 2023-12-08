'use client';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { type DevApplicationSelect } from '@/server/db/schema';
import { api } from '@/trpc/react';

import { LucideGithub, LucideLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function DevApplicationCard({
  application,
}: {
  application: DevApplicationSelect;
}) {
  const { isLoading, mutateAsync } = api.admin.approveDev.useMutation({
    onSuccess: () => {
      toast({ title: 'Approved' });
    },
  });
  const { data } = api.admin.getDevApplicationMedia.useQuery({
    applicationId: application.id,
  });
  const videoUrl = data?.applicationMedia?.url;
  const router = useRouter();
  const gitHubLink = application.gitHubUsername.startsWith(
    'https://github.com/',
  )
    ? application.gitHubUsername
    : `https://github.com/${application.gitHubUsername}`;
  return (
    <Card key={application.id} className="grid w-full max-w-[16rem] gap-1">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{application.displayName}</CardTitle>
        <CardDescription>{application.bio}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-3 ">
          <Link href={gitHubLink} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="aspect-square h-10 w-10 p-0">
              <LucideGithub />
            </Button>
          </Link>
          <Link
            href={`https://twitter.com/${application.twitterUsername}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="aspect-square h-10 w-10 p-0">
              𝕏
            </Button>
          </Link>

          {application.websiteUrl && (
            <Link
              href={application.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="aspect-square h-10 w-10 p-0">
                <LucideLink />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Dialog>
          <Button asChild variant={'link'} className="underline">
            {videoUrl && <DialogTrigger>View Video</DialogTrigger>}
          </Button>
          <DialogContent>
            {videoUrl && (
              <video src={videoUrl + '.mp4'} autoPlay controls></video>
            )}
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <Button asChild variant={'brand'} className="hover:cursor-pointer">
            <AlertDialogTrigger>Approve</AlertDialogTrigger>
          </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will approve the developer and allow them to upload their
                projects.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant={'brand'}
                type="button"
                onClick={async () => {
                  await mutateAsync({ applicationId: application.id });
                  router.refresh();
                }}
              >
                {isLoading ? 'Loading' : 'Yes Bro'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
