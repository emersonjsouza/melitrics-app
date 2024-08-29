import { useQuery } from "@tanstack/react-query";
import { listOrders } from "../services/app";

export const useOrders = (query: { organizationID: string, start: string, end: string, offset: number, enableFetching: boolean }) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [`orders`, query.organizationID, query.start, query.end, query.offset],
    queryFn: () => listOrders(query.organizationID, query.start, query.end, query.offset),
    enabled: query.enableFetching
  });

  return {
    data: isFetching ? [] : data?.items,
    total: data?.total || 0,
    isFetching,
    refetch
  };
};