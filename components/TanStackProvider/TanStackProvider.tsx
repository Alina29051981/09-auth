'use client';
import { useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider, Hydrate, DehydratedState } from '@tanstack/react-query';

interface Props {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}

export default function TanStackProvider({ children, dehydratedState }: Props) {
  const [queryClient] = useState(() => 
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60,
          retry: 1,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>{children}</Hydrate>
    </QueryClientProvider>
  );
}
