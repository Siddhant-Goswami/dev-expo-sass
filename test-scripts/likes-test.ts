import { db } from '@/server/db';
import { likes } from '@/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';

/**
 * * Use `bun` to run this script */

const userId = '';
const projectId = 1;

const result = await db
  .select({ count: sql<number>`cast(count(${likes}) as int)` })
  .from(likes)
  .where(and(eq(likes.projectId, projectId), eq(likes.userId, userId)));

console.log(result);
