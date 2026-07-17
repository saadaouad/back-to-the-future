import { z } from 'zod';

export const calculateCartBodySchema = z.object({
  cart: z.string().min(1, 'Cart text is required')
});

export type CalculateCartBody = z.infer<typeof calculateCartBodySchema>;

export type CartLine = {
  title: string;
  unitPrice: number;
  isSaga: boolean;
};

export type CalculateCartResponse = {
  total: number;
  discountPercent: number;
  items: CartLine[];
};
