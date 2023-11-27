import { env } from '@/env';
import { type Config } from 'drizzle-kit';

export default {
  schema: './src/server/db/schema.ts',
  driver: 'pg',
  out: './src/server/db/migrations/',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ['*'],
} satisfies Config;
