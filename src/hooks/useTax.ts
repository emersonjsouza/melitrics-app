import { useQuery } from "@tanstack/react-query";
import { getTax } from "../services";

export const useTax = (query: { organizationID: string | undefined, id: string | undefined }) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [`tax`, query.organizationID, String(query.id)],
    queryFn: () => getTax(query.organizationID || '', String(query.id)),
    enabled: false
  });

  return {
    data: data,
    isFetching,
    refetch
  };
};