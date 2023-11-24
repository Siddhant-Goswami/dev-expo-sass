import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { z } from 'zod';

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      //
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      orderBy: (u, { desc }) => [desc(u.createdAt)],
    });
  }),
});
