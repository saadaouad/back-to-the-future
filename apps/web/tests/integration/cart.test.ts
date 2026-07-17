import { createElement } from 'react';
import { screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '@/App.tsx';
import { renderWithProviders } from '../helpers/renderWithProviders.ts';

describe('Cart integration', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders the cart form', () => {
    renderWithProviders(createElement(App));

    expect(screen.getByTestId('app-title')).toBeInTheDocument();
    expect(screen.getByTestId('cart-input')).toBeInTheDocument();
    expect(screen.getByTestId('calculate-button')).toBeDisabled();
  });

  it('calculates the order total from the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        total: 56,
        discountPercent: 20,
        items: []
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    const { user } = renderWithProviders(createElement(App));
    const cart = `Back to the Future 1
Back to the Future 2
Back to the Future 3
La chèvre`;

    await user.click(screen.getByTestId('cart-input'));
    await user.paste(cart);
    await user.click(screen.getByTestId('calculate-button'));

    await waitFor(() => {
      expect(screen.getByTestId('cart-total')).toHaveTextContent('56');
    });

    expect(screen.getByTestId('cart-discount')).toHaveTextContent('Remise saga 20');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/cart/calculate'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ cart })
      })
    );
  });

  it('shows an error when the API fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Server error'
      })
    );

    const { user } = renderWithProviders(createElement(App));

    await user.click(screen.getByTestId('cart-input'));
    await user.paste('Back to the Future 1');
    await user.click(screen.getByTestId('calculate-button'));

    expect(await screen.findByTestId('cart-error')).toHaveTextContent('Server error');
  });
});
