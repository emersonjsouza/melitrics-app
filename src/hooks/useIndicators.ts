import { useQuery } from "@tanstack/react-query";
import { getIndicators } from "../services";

export const useIndicators = (query: { organizationID: string, start: string, end: string }) => {
  const { data, isFetching, refetch, isRefetching } = useQuery({
    queryKey: [`indicators`, query.organizationID, query.start, query.end],
    queryFn: () => getIndicators(query.organizationID, query.start, query.end)
  });

  return {
    data: data,
    isFetching,
    isRefetching,
    refetch
  };
};