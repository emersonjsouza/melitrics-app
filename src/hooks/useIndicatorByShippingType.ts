import { useQuery } from "@tanstack/react-query";
import { getIndicatorsByShippingType } from "../services";

export const useIndicatorsByShippingType = (query: { organizationID: string, start: string, end: string }) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [`indicators-shipping-type`, query.organizationID, query.start, query.end],
    queryFn: () => getIndicatorsByShippingType(query.organizationID, query.start, query.end),
  });

  return {
    data: data,
    isFetching,
    refetch
  };
};