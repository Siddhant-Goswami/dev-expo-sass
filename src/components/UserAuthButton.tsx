'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabaseClientComponentClient, useAuth } from '@/hooks/user/auth';
import { useUserProfile } from '@/hooks/user/profile';
import { URLs } from '@/lib/constants';
import { LogOutIcon, User2Icon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import Link from 'next/link';

export default function UserAuthButton() {
  const { session } = useAuth();
  // const { username } = useUserProfile();
  const supabase = supabaseClientComponentClient();
  // console.log(username);
  return (
    <Popover>
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
      <PopoverContent className="w-fit">
        <ul className="flex flex-col gap-2">
          {/* {username && <li>
            <Link href={`/user/${username}`}>
              <Button
                variant="outline"
                className="flex w-full items-center gap-3"
              >
                <User2Icon />
                Profile
              </Button>
            </Link>
          </li>} */}
          <li>
            <Button
              variant="outline"
              className="flex w-full items-center gap-3"
              onClick={async () => {
                const { error } = await supabase.auth.signOut();
                if (error) {
                  alert(error.message);
                } else {
                  window.location.href = URLs.home;
                }
              }}
            >
              <LogOutIcon />
              Logout
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
