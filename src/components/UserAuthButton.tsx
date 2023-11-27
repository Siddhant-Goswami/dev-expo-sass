'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabaseClientComponentClient, useAuth } from '@/hooks/user/auth';
import { URLs } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export default function UserAuthButton() {
  const { session } = useAuth();
  const supabase = supabaseClientComponentClient();

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
      <PopoverContent className="">
        <Button
          onClick={async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              alert(error.message);
            } else {
              window.location.href = URLs.home;
            }
          }}
        >
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
}
