import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql } from 'drizzle-orm';

import '../env';
import { db, pool } from '../src/db/connection';
import { films } from '../src/db/schema';

// Vitest loads this file as ESM; Nest tsc uses CommonJS and can't typecheck import.meta.
const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../');

export default async function setup() {
  console.log('Setting up the test db');

  try {
    await db.execute(sql`DROP TABLE IF EXISTS ${films} CASCADE`);

    execSync('npx drizzle-kit push --force', {
      stdio: 'inherit',
      cwd: apiRoot,
      env: process.env
    });

    console.log('Test DB created');
  } catch (error) {
    console.error('Fail to setup test db', error);
    throw error;
  }

  return async () => {
    try {
      await db.execute(sql`DROP TABLE IF EXISTS ${films} CASCADE`);
      await pool.end();
    } catch (error) {
      console.error('Fail to teardown test db', error);
      throw error;
    }
  };
}
