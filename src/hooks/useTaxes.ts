import { useQuery } from "@tanstack/react-query";
import { listTax } from "../services";

export const useTaxes = (query: { organizationID: string, sku: string }) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['taxes', query.organizationID, query.sku],
    queryFn: () => listTax(query.organizationID, query.sku, 0),
    enabled: false
  })

  return {
    data: data?.items,
    isFetching,
    refetch,
  };
};