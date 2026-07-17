const API_URL = import.meta.env.VITE_API_URL;

export async function api<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers
    }
  });

  if (!res.ok) {
    throw new Error((await res.text()) || `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}
