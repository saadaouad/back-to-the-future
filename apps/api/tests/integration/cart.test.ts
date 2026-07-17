import 'reflect-metadata';

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '@/app.module';
import { DatabaseService } from '@/db/database.service';

import { cleanupDatabase, seedFilms } from '../helpers/dbHelpers';

describe('POST /cart/calculate', () => {
  let app: INestApplication;
  let database: DatabaseService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    database = app.get(DatabaseService);
    await seedFilms(database.db);
  });

  afterEach(async () => {
    await seedFilms(database.db);
  });

  afterAll(async () => {
    await cleanupDatabase(database.db);
    await app.close();
  });

  it('returns the order total for a mixed cart', async () => {
    const response = await request(app.getHttpServer())
      .post('/cart/calculate')
      .send({
        cart: `Back to the Future 1
Back to the Future 2
Back to the Future 3
La chèvre`
      })
      .expect(201);

    expect(response.body).toMatchObject({
      total: 56,
      discountPercent: 20
    });
    expect(response.body.items).toHaveLength(4);
  });

  it('rejects an empty cart', async () => {
    await request(app.getHttpServer()).post('/cart/calculate').send({ cart: '' }).expect(400);
  });
});
