import { DatabaseService } from './database.service';
import { films } from './schema';

const database = new DatabaseService();

const catalog: Array<{ title: string; price: number; isSaga: boolean }> = [
  { title: 'Back to the Future 1', price: 15, isSaga: true },
  { title: 'Back to the Future 2', price: 15, isSaga: true },
  { title: 'Back to the Future 3', price: 15, isSaga: true },
  { title: 'La chèvre', price: 20, isSaga: false }
];

async function seed() {
  console.log('Seeding film catalog...');

  await database.db.delete(films);

  await database.db.insert(films).values(catalog);

  console.log(`Seeded ${catalog.length} films.`);
}

seed()
  .then(() => database.onModuleDestroy())
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  });
