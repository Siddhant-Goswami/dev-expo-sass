/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { ADMIN_ROLES } from '@/app/(admin)/constants';
import { db } from '@/server/db';
import {
  createRouteHandlerClient,
  type Session,
} from '@supabase/auth-helpers-nextjs';
import { type ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { type NextRequest } from 'next/server';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

export type CreateContextOptions = {
  headers: Headers;
  session: Session | null;
  db: typeof db;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    db: opts.db,
    session: opts.session,
    headers: opts.headers,
  };
};
/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: {
  req: NextRequest;
  cookies: () => ReadonlyRequestCookies;
  headers: () => ReadonlyHeaders;
}) => {
  // Fetch stuff that depends on the request
  //
  const supabase = createRouteHandlerClient({ cookies: opts.cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // const auth = getAuth(opts.req);

  return createInnerTRPCContext({
    session,
    db,
    headers: opts.headers(),
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Authenticated procedure
 *
 * This is the same as `publicProcedure`, but it guarantees that the user is logged in. If they are
 * not, the request will fail with a 401.
 */

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

export const privateProcedure = publicProcedure.use(enforceUserIsAuthed);

const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (ctx.session?.user.role !== ADMIN_ROLES._100xAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You must be an admin to perform this action.',
    });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});
export const adminProcedure = privateProcedure.use(enforceUserIsAdmin);
