import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { assertEnv, env } from '../../env';
import * as schema from './schema';

assertEnv();

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DATABASE_URL.includes('localhost') ? undefined : { rejectUnauthorized: false }
});

export const db = drizzle({ client: pool, schema });

export default db;
