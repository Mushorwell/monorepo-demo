import { makeFetchCall, Options } from '@monorepo-demo/utilities';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef } from 'react';

interface UseInfiniteScrollOptions<T> {
  url: string;
  fetchOptions?: Options<any>;
  queryKey: string[];
  getNextPageParam?: (lastPage: T) => number | boolean;
}

export const useInfiniteScroll = <T>({
  url,
  fetchOptions,
  queryKey,
  getNextPageParam = (lastPage: any) => lastPage.nextPage ?? false,
}: UseInfiniteScrollOptions<T>) => {
  const observer = useRef<IntersectionObserver | undefined>();
  const fetch = makeFetchCall();

  const fetchData = async ({ pageParam = 1 }): Promise<T> => {
    const response = await fetch.get<T>(
      `${url}?page=${pageParam}`,
      fetchOptions
    );
    return response;
  };

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery(queryKey, fetchData, {
      getNextPageParam,
    });

  const lastElementRef = (node: Element | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  };

  return {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    lastElementRef,
  };
};
