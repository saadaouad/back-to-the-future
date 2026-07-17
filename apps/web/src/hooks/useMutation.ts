import { useMutation as useReactQueryMutation } from '@tanstack/react-query';

import { api } from '@/utils/api';

type MutationParams = {
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
};

export function useMutation<T>() {
  const { mutate, isPending, data, error, reset } = useReactQueryMutation({
    mutationFn: ({ endpoint, method, body }: MutationParams) =>
      api<T>(endpoint, {
        method,
        body: body != null ? JSON.stringify(body) : undefined
      })
  });

  return { mutate, loading: isPending, data, error, reset };
}
