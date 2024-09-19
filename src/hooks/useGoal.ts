import { useQuery } from "@tanstack/react-query";
import { getGoal } from "../services";

export const useGoal = (query: { organizationID: string | undefined }) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [`goal`, query.organizationID],
    queryFn: () => getGoal(query?.organizationID || ''),
    enabled: !!query.organizationID
  });

  return {
    data: data,
    isFetching,
    refetch
  };
};