import { db } from '@/server/db';
import { upvotes } from '@/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';

/**
 * * Use `bun` to run this script */

const userId = '';
const projectId = 1;

const result = await db
  .select({ count: sql<number>`cast(count(${upvotes}) as int)` })
  .from(upvotes)
  .where(and(eq(upvotes.projectId, projectId), eq(upvotes.userId, userId)));

console.log(result);
