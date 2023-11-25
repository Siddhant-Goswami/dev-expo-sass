'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  supabaseClientComponentClient,
  useUserSession,
} from '@/hooks/user/auth';
import { URLs } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export default function UserAuthButton() {
  const { session } = useUserSession();
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
            // alt={session.data.user?.user_metadata?.name ?? 'NO NAME'}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>
        <Button
          onClick={async () => {
            const { error } = await supabase.auth.signOut();

            if (error) {
              alert(error.message);
            } else {
              window.location.href = URLs.signIn;
            }
          }}
        >
          Logout
        </Button>
        {/*  */}
      </PopoverContent>
    </Popover>
  );
}
