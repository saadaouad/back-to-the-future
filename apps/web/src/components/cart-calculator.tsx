import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@/hooks/useMutation';
import type { CalculateCartResponse } from '@repo/schema-validation';

const PLACEHOLDER = `Back to the Future 1
Back to the Future 2
Back to the Future 3
La chèvre`;

export function CartCalculator() {
  const [cart, setCart] = useState('');
  const { mutate, loading, data: result, error, reset } = useMutation<CalculateCartResponse>();

  function onCartChange(value: string) {
    setCart(value);
    reset();
  }

  function calculate() {
    const trimmed = cart.trim();
    if (!trimmed) return;
    mutate({ endpoint: '/cart/calculate', method: 'POST', body: { cart: trimmed } });
  }

  return (
    <section className="space-y-6" aria-label="Calcul du panier">
      <div className="space-y-2">
        <label htmlFor="cart-input" className="block text-sm font-medium text-foreground">
          Panier
        </label>
        <Textarea
          id="cart-input"
          data-testid="cart-input"
          value={cart}
          onChange={(event) => onCartChange(event.target.value)}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          className="min-h-[180px] resize-y font-mono text-[15px] leading-relaxed"
        />
        <p className="text-sm text-muted-foreground">Un titre de film par ligne.</p>
      </div>

      <Button
        type="button"
        data-testid="calculate-button"
        disabled={!cart.trim() || loading}
        onClick={calculate}
      >
        {loading ? 'Calcul…' : 'Calculer le prix'}
      </Button>

      {error ? (
        <p data-testid="cart-error" className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      ) : null}

      {result ? (
        <output
          data-testid="cart-result"
          className="block animate-[total-in_0.4s_ease-out]"
          htmlFor="cart-input"
          aria-live="polite"
        >
          <p className="text-sm text-muted-foreground">Prix de la commande</p>
          <p
            data-testid="cart-total"
            className="mt-1 font-display text-6xl tracking-wide text-foreground tabular-nums"
          >
            {result.total}
            <span className="ml-1 text-2xl text-muted-foreground">€</span>
          </p>
          {result.discountPercent > 0 ? (
            <p data-testid="cart-discount" className="mt-2 text-sm text-muted-foreground">
              Remise saga {result.discountPercent}&nbsp;%
            </p>
          ) : null}
        </output>
      ) : null}
    </section>
  );
}
