import { afterEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/utils/api';

describe('api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fetches JSON from the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ total: 36 })
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(api<{ total: number }>('/cart/calculate')).resolves.toEqual({ total: 36 });
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/api/cart/calculate', {
      headers: { Accept: 'application/json' }
    });
  });

  it('throws when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Server error'
      })
    );

    await expect(api('/cart/calculate')).rejects.toThrow('Server error');
  });
});
