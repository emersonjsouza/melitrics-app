import { useQuery } from "@tanstack/react-query";
import { getAd } from "../services";
import { Ad } from "../services/types";

export const useAd = (query: { organizationID: string | undefined, id: string | undefined }) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [`ad`, query.organizationID, query.id],
    queryFn: () => getAd(query?.organizationID || '', query?.id || ''),
    enabled: !!query.id && !!query.organizationID
  });

  return {
    item: data || {} as Ad,
    isFetching,
    refetch
  };
};