'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabaseClientComponentClient, useAuth } from '@/hooks/user/auth';
import { api } from '@/trpc/react';
import { ExitIcon, PersonIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from './ui/use-toast';
export default function UserAuthButton() {
  const { session } = useAuth();
  const { data } = api.user.hello.useQuery(undefined, {
    enabled: !!session?.user?.id,
  });

  const router = useRouter();

  const supabase = supabaseClientComponentClient();

  const username = data?.userProfile?.username;

  const userDisplayName =
    (session?.user?.user_metadata?.name as string) ?? 'Your Account';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
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
          <AvatarFallback>
            {
              // First letter of the name
              userDisplayName ? userDisplayName.charAt(0).toUpperCase() : 'U'
            }
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{userDisplayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {username && (
          <Link href={`/user/${username}`}>
            <DropdownMenuItem>
              <PersonIcon className="mr-2" />
              Profile
            </DropdownMenuItem>
          </Link>
        )}

        <DropdownMenuItem
          onClick={async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              toast({
                title: 'Could not logout',
                description: error.message,
              });
            } else {
              // router.push(URLs.home);
              window.location.reload();
            }
          }}
        >
          <ExitIcon className="mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    // <Popover modal={true}>
    //   <PopoverTrigger>

    //   </PopoverTrigger>
    //   <PopoverContent className="w-44 p-1">
    //     {username && (
    //       <Link href={`/user/${username}`}>
    //         <Button
    //           variant="outline"
    //           className="flex w-full items-center gap-3"
    //         >
    //           <LucideUser2 />
    //           Profile
    //         </Button>
    //       </Link>
    //     )}
    //     <Button
    //       variant="outline"
    //       className="flex w-full items-center gap-3 rounded-sm"
    //       onClick={async () => {
    //         const { error } = await supabase.auth.signOut();
    //         if (error) {
    //           toast({
    //             title: 'Could not logout',
    //             description: error.message,
    //           });
    //         } else {
    //           redirect(URLs.home);
    //         }
    //       }}
    //     >
    //       <LogOutIcon />
    //       Logout
    //     </Button>
    //   </PopoverContent>
    // </Popover>
  );
}
