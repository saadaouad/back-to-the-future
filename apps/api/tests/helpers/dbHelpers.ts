import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type * as schema from '../../src/db/schema';
import { films } from '../../src/db/schema';

type Db = NodePgDatabase<typeof schema>;

export const catalog = [
  { title: 'Back to the Future 1', price: 15, isSaga: true },
  { title: 'Back to the Future 2', price: 15, isSaga: true },
  { title: 'Back to the Future 3', price: 15, isSaga: true },
  { title: 'La chèvre', price: 20, isSaga: false }
] as const;

export async function seedFilms(db: Db) {
  await db.delete(films);
  await db.insert(films).values([...catalog]);
}

export async function cleanupDatabase(db: Db) {
  await db.delete(films);
}
