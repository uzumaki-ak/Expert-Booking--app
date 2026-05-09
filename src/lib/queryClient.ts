import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        // Mobile networks drop frequently — refetch on reconnect is essential
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
