import { useQuery } from "@tanstack/react-query";
import { getTax } from "../services";

export const useTax = (query: { organizationID: string | undefined, id: string | undefined }) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [`indicators`, query.organizationID, query.id],
    queryFn: () => getTax(query?.organizationID || '', query?.id || ''),
    enabled: !!query.id && !!query.organizationID
  });

  return {
    data: data,
    isFetching,
    refetch
  };
};