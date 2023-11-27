'use server';

import {
  createUserProfileInDb,
  getUserProfileFromDb,
} from '@/server/actions/users';
import { type UserProfileSelect } from '@/server/db/schema';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getOrCreateUserProfile() {
  try {
    // TODO: Better name for this.
    let user: UserProfileSelect | null;

    const supabase = createServerActionClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return null;
    }

    const loggedInUser = session.user;
    const userId = loggedInUser.id;

    const existingUser = await getUserProfileFromDb(userId);

    if (existingUser?.id) {
      user = existingUser;
    } else {
      const { user: newUserInDb } = await createUserProfileInDb({
        id: userId,
        displayName: loggedInUser.user_metadata.name as unknown as string,
        username:
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          (loggedInUser.user_metadata?.email?.split(
            '@',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          )?.[0] as unknown as string) ??
          (Math.random().toString(36).substring(7) + Date.now()).toString(),
        bio: `Hi, I'm ${loggedInUser.user_metadata.name}, one of the early users of this platform!`,
        displayPictureUrl: loggedInUser.user_metadata
          .avatar_url as unknown as string,
      });

      // 'Actions' that fire up when a user signs up
      //   await Promise.allSettled([
      //     createStripeCustomerByUserId(userId),
      //     addDefaultCharactersForUser(userId),
      //   ]);

      user = newUserInDb;

      return user;
    }
  } catch (err) {}
}
