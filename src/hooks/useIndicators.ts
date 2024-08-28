import { useQuery } from "@tanstack/react-query";
import { getIndicators } from "../services/app";

export const useIndicators = (query: { organizationID: string, start: string, end: string, enableFetching: boolean }) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [`indicators`, query.organizationID, query.start, query.end],
    queryFn: () => getIndicators(query.organizationID, query.start, query.end),
    enabled: query.enableFetching
  });

  return {
    data: data,
    isFetching,
    refetch
  };
};