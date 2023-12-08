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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type DevApplicationSelect } from '@/server/db/schema';
import { api } from '@/trpc/react';

import { LucideGithub } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DevApplicationCard({
  application,
}: {
  application: DevApplicationSelect;
}) {
  const { isSuccess, isLoading, data, mutateAsync } =
    api.admin.approveDev.useMutation();
  const router = useRouter();
  return (
    <Card key={application.id} className=" grid max-w-md gap-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{application.displayName}</CardTitle>

        <CardDescription>{application.bio}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline" className="aspect-square h-10 w-10 p-0">
            <LucideGithub />
          </Button>
          <Button variant="outline" className="aspect-square h-10 w-10 p-0">
            𝕏
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <Button asChild variant={'brand'} className="hover:cursor-pointer">
            <AlertDialogTrigger>Approve</AlertDialogTrigger>
          </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
               This will approve the developer and allow them to upload their projects.
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
