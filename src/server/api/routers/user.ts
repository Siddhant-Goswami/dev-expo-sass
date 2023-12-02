import { getOrCreateUserProfile } from '@/hooks/user/actions';
import { createTRPCRouter, privateProcedure } from '@/server/api/trpc';

export const userRouter = createTRPCRouter({
  /**
   * Creates a user profile in the database if it doesn't exist
   * @returns User profile from the database
   */
  hello: privateProcedure.query(async ({ ctx }) => {
    const loggedInUser = ctx.session.user;
    const userId = loggedInUser.id;

    console.log('Getting user from db:', userId);

    const userInDb = await getOrCreateUserProfile(ctx);

    return {
      userProfile: userInDb,
    };
  }),
});
