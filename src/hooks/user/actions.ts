import 'server-only';

import {
  createUserProfileInDb,
  getUserProfileFromDb,
} from '@/server/actions/users';
import { type CreateContextOptions } from '@/server/api/trpc';
import { type UserProfileSelect } from '@/server/db/schema';
import { z } from 'zod';

export async function getOrCreateUserProfile({
  session,
}: {
  session: NonNullable<CreateContextOptions['session']>;
}) {
  try {
    let userInDb: UserProfileSelect | null;

    if (!session) {
      throw new Error('No session found!');
    }

    const loggedInUser = session.user;
    const userId = loggedInUser.id;

    const existingUser = await getUserProfileFromDb(userId);

    if (existingUser?.id) {
      console.log('Found existing user in db:', existingUser.id);
      userInDb = existingUser;
    } else {
      const parsedUserResult = z
        .object({
          name: z.string({ required_error: 'User must have a name!' }),
          email: z.string().email('User has an invalid email address!'),
          displayPictureUrl: z
            .string()
            .url('User has an invalid avatar url!')
            .catch(`https://avatar.vercel.sh/nextjs`),
        })
        .parse({
          ...loggedInUser.user_metadata,

          email: loggedInUser.email,

          displayPictureUrl: session?.user?.user_metadata
            ?.avatar_url as unknown as string,
        });

      const { user: newUserInDb } = await createUserProfileInDb({
        id: userId,
        displayName: loggedInUser.user_metadata.name as unknown as string,
        username: parsedUserResult.email.split('@')[0]!,
        bio: `Hi, I'm ${loggedInUser.user_metadata.name}, one of the early users of this platform!`,
        displayPictureUrl: parsedUserResult.displayPictureUrl,
      });

      // 'Actions' that fire up when a user "signs up"
      //   await Promise.allSettled([
      //     createStripeCustomerByUserId(userId),
      //     addDefaultCharactersForUser(userId),
      //   ]);

      userInDb = newUserInDb;
    }
    return userInDb;
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      throw err;
    }

    throw new Error(
      (err as Error)?.message ??
        'Something went wrong when making user profile in db!',
    );
  }
}
