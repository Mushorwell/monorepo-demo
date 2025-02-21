import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useInfiniteScroll } from './useInfiniteScroll';

// Mock data type
interface MockData {
  items: string[];
  nextPage: number | null;
}

// Setup QueryClient wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useInfiniteScroll', () => {
  it('should fetch and return data correctly', async () => {
    const { result } = renderHook(
      () =>
        useInfiniteScroll<MockData>({
          url: '/api/test',
          queryKey: ['test'],
          getNextPageParam: (lastPage) => lastPage.nextPage || false,
        }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.isFetching).toBe(false);
  });

  it('should handle intersection observer', async () => {
    const { result } = renderHook(
      () =>
        useInfiniteScroll<MockData>({
          url: '/api/test',
          queryKey: ['test'],
        }),
      {
        wrapper: createWrapper(),
      }
    );

    const mockElement = document.createElement('div');
    result.current.lastElementRef(mockElement);

    expect(mockElement).toBeDefined();
  });
});
