import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      orderBy: (u, { desc }) => [desc(u.createdAt)],
    });
  }),
});
