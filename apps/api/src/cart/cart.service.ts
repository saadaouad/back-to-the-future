import { Inject, Injectable } from '@nestjs/common';
import type { CalculateCartBody, CalculateCartResponse } from '@repo/schema-validation';

import { DatabaseService } from '@/db/database.service';
import { films } from '@/db/schema';
import { buildCartBreakdown, parseCart } from '@/utils/pricing';

@Injectable()
export class CartService {
  constructor(@Inject(DatabaseService) private readonly database: DatabaseService) {}

  async calculate(body: CalculateCartBody): Promise<CalculateCartResponse> {
    const titles = parseCart(body.cart);
    const catalog = await this.database.db
      .select({
        title: films.title,
        price: films.price,
        isSaga: films.isSaga
      })
      .from(films);

    return buildCartBreakdown(titles, catalog);
  }
}
