import { QueryClient } from '@tanstack/react-query';

/**
 * Shared TanStack Query client factory.
 *
 * - staleTime 60s — avoid unnecessary refetches
 * - gcTime 5min — keep inactive data briefly
 * - retry 1 — retry failed queries once
 * - refetchOnWindowFocus false — no surprise refetches
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
