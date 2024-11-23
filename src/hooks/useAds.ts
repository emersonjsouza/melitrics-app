import { useInfiniteQuery } from "@tanstack/react-query";
import { listAds } from "../services";

export const useAds = (query: { organizationID: string, status: string, subStatus: string, logisticType: string, search: string }) => {
  const { data, isFetching, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['ads', query.organizationID, query.status, query.subStatus, query.logisticType, query.search],
    queryFn: ({ pageParam }) => {
      return listAds(query.organizationID, pageParam, query.status, query.subStatus, query.logisticType, query.search)
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