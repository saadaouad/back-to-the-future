import { db } from './connection';
import { films } from './schema';

const catalog: Array<{ title: string; price: number; isSaga: boolean }> = [
  { title: 'Back to the Future 1', price: 15, isSaga: true },
  { title: 'Back to the Future 2', price: 15, isSaga: true },
  { title: 'Back to the Future 3', price: 15, isSaga: true },
  { title: 'La chèvre', price: 20, isSaga: false }
];

async function seed() {
  console.log('Seeding film catalog...');

  await db.delete(films);

  await db.insert(films).values(catalog);

  console.log(`Seeded ${catalog.length} films.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  });
