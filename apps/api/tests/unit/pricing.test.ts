import { describe, expect, it } from 'vitest';

import {
  type CatalogFilm,
  buildCartBreakdown,
  calculatePrice,
  parseCart
} from '../../src/utils/pricing';

const catalog: CatalogFilm[] = [
  { title: 'Back to the Future 1', price: 15, isSaga: true },
  { title: 'Back to the Future 2', price: 15, isSaga: true },
  { title: 'Back to the Future 3', price: 15, isSaga: true },
  { title: 'La chèvre', price: 20, isSaga: false }
];

describe('parseCart', () => {
  it('splits lines, trims, and drops empties', () => {
    expect(
      parseCart(`
Back to the Future 1

Back to the Future 2
`)
    ).toEqual(['Back to the Future 1', 'Back to the Future 2']);
  });
});

describe('calculatePrice', () => {
  it('charges 15 for a single saga film', () => {
    expect(calculatePrice(['Back to the Future 1'], catalog)).toBe(15);
  });

  it('applies 10% when there are 2 distinct saga titles', () => {
    expect(calculatePrice(['Back to the Future 1', 'Back to the Future 3'], catalog)).toBe(27);
  });

  it('applies 20% when there are 3 distinct saga titles', () => {
    expect(
      calculatePrice(
        ['Back to the Future 1', 'Back to the Future 2', 'Back to the Future 3'],
        catalog
      )
    ).toBe(36);
  });

  it('counts duplicates for quantity but not for the discount', () => {
    expect(
      calculatePrice(
        [
          'Back to the Future 1',
          'Back to the Future 2',
          'Back to the Future 3',
          'Back to the Future 2'
        ],
        catalog
      )
    ).toBe(48);
  });

  it('does not discount other films', () => {
    expect(
      calculatePrice(
        ['Back to the Future 1', 'Back to the Future 2', 'Back to the Future 3', 'La chèvre'],
        catalog
      )
    ).toBe(56);
  });

  it('prices unknown titles as other films', () => {
    expect(calculatePrice(['Unknown'], catalog)).toBe(20);
  });
});

describe('buildCartBreakdown', () => {
  it('returns total, discount, and line items', () => {
    const result = buildCartBreakdown(
      ['Back to the Future 1', 'Back to the Future 2', 'La chèvre'],
      catalog
    );

    expect(result).toEqual({
      total: 47,
      discountPercent: 10,
      items: [
        { title: 'Back to the Future 1', unitPrice: 15, isSaga: true },
        { title: 'Back to the Future 2', unitPrice: 15, isSaga: true },
        { title: 'La chèvre', unitPrice: 20, isSaga: false }
      ]
    });
  });
});
