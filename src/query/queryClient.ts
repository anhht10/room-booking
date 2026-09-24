import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes before considering data stale
      gcTime: 1000 * 60 * 10,    // 10 minutes cache garbage collection
      retry: 1,                 // Retry once on failure
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

