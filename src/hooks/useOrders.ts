import { useInfiniteQuery } from "@tanstack/react-query";
import { listOrders } from "../services";

export const useOrders = (query: { organizationID: string, status: string, shippingType: string, start: string, end: string }) => {
  const { data, isFetching, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['orders', query.start, query.end, query.status, query.shippingType],
    queryFn: ({ pageParam }) => {
      return listOrders(query.organizationID, query.status, query.shippingType, query.start, query.end, pageParam)
    },
    getNextPageParam: (lastPage, pages) => {
      if (pages.flatMap(p => p.items).length < lastPage.total) {
        return pages.flatMap(p => p.items).length
      }
      return undefined
    },
    initialPageParam: 0,
  })

  return {
    data: data?.pages,
    total: data?.pages[0].total || 0,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  };
};