import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services";

export const useOrganizations = (query: { userID: string, enabled: boolean }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['user', query.userID],
    queryFn: ({ pageParam }) => {
      return getUser(query.userID)
    },
    enabled: query.enabled,
  })

  return {
    organizations: data?.organizations,
    isLoading
  };
};