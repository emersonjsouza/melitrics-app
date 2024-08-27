import { useQuery } from "@tanstack/react-query";
import { getIndicatorsByShippingType } from "../services/app";

export const useIndicatorsByShippingType = (query: { organizationID: string, start: string, end: string, enableFetching: boolean }) => {
  const { data, isFetching } = useQuery({
    queryKey: [`indicators-shipping-type`, query.organizationID, query.start, query.end],
    queryFn: () => getIndicatorsByShippingType(query.organizationID, query.start, query.end),
    enabled: query.enableFetching
  });

  return {
    data: data,
    isFetching
  };
};