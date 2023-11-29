import { createTRPCRouter, privateProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { TRPCError } from '@trpc/server';

export const userRouter = createTRPCRouter({
  hello: privateProcedure
    // .input(z.object({ text: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session;

      const userProfile = await db.query.userProfiles.findFirst({
        where: (up, { eq }) => eq(up.id, user.id),
      });

      if (!userProfile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User profile not found',
        });
      }

      return {
        userProfile,
      };
    }),
});
