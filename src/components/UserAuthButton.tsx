'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabaseClientComponentClient, useAuth } from '@/hooks/user/auth';
import { URLs } from '@/lib/constants';
import { api } from '@/trpc/react';
import { LogOutIcon, LucideUser2 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

export default function UserAuthButton() {
  const { session } = useAuth();
  const { data } = api.user.hello.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });

  const supabase = supabaseClientComponentClient();

  const username = data?.userProfile?.username;

  return (
    <Popover modal={true}>
      <PopoverTrigger>
        <Avatar>
          <AvatarImage
            src={
              // ! Bad types, please use zod for this instead...
              (session?.user?.user_metadata?.avatar_url as unknown as
                | string
                | null) ?? `https://avatar.vercel.sh/1`
            }
            alt={
              // ! Bad types, please use zod for this instead...
              (session?.user?.user_metadata?.name as unknown as
                | string
                | null) ?? 'User Avatar'
            }
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1">
        {username && (
          <Link href={`/user/${username}`}>
            <Button
              variant="outline"
              className="flex w-full items-center gap-3"
            >
              <LucideUser2 />
              Profile
            </Button>
          </Link>
        )}
        <Button
          variant="outline"
          className="flex w-full items-center gap-3 rounded-sm"
          onClick={async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              toast({
                title: 'Could not logout',
                description: error.message,
              });
            } else {
              redirect(URLs.home);
            }
          }}
        >
          <LogOutIcon />
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
}
