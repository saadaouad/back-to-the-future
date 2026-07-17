const OTHER_UNIT_PRICE = 20;

export type CatalogFilm = {
  title: string;
  price: number;
  isSaga: boolean;
};

export type CartBreakdownItem = {
  title: string;
  unitPrice: number;
  isSaga: boolean;
};

export function parseCart(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toItems(titles: string[], catalog: Iterable<CatalogFilm>): CartBreakdownItem[] {
  const byTitle = new Map(
    [...catalog].map((film) => [film.title.trim().toLowerCase(), film] as const)
  );

  return titles.map((title) => {
    const film = byTitle.get(title.trim().toLowerCase());
    if (film) {
      return {
        title,
        unitPrice: film.price,
        isSaga: film.isSaga
      };
    }

    return {
      title,
      unitPrice: OTHER_UNIT_PRICE,
      isSaga: false
    };
  });
}

/** 2 distinct saga titles → 10%, 3+ → 20%. */
function discountPercent(items: CartBreakdownItem[]): number {
  const distinct = new Set(
    items.filter((item) => item.isSaga).map((item) => item.title.trim().toLowerCase())
  );

  if (distinct.size >= 3) return 20;
  if (distinct.size === 2) return 10;
  return 0;
}

export function buildCartBreakdown(titles: string[], catalog: Iterable<CatalogFilm>) {
  const items = toItems(titles, catalog);
  const percent = discountPercent(items);
  const factor = 1 - percent / 100;

  const total = items.reduce(
    (sum, item) => sum + (item.isSaga ? item.unitPrice * factor : item.unitPrice),
    0
  );

  return { total, discountPercent: percent, items };
}

export function calculatePrice(titles: string[], catalog: Iterable<CatalogFilm>): number {
  return buildCartBreakdown(titles, catalog).total;
}
