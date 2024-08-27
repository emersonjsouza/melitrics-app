import { useQuery } from "@tanstack/react-query";
import { getIndicators } from "../services/app";

export const useIndicators = (query: { organizationID: string, start: string, end: string }) => {
    const { data, isFetching } = useQuery({
        queryKey: [`indicators`, query.organizationID],
        queryFn: () => getIndicators(query.organizationID, query.start, query.end),
    });

    return {
        data: data,
        isFetching
    };
};