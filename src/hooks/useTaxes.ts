import { useQuery } from "@tanstack/react-query";
import { listTax } from "../services";

export const useTaxes = (query: { organizationID: string, externalItemID: string, taxID: string }) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['taxes', query.organizationID, query.externalItemID, query.taxID],
    queryFn: () => listTax(query.organizationID, query.externalItemID, query.taxID, 0),
    enabled: false
  })

  return {
    data: data?.items,
    isFetching,
    refetch,
  };
};