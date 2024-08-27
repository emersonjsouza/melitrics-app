import { useQuery } from "@tanstack/react-query";
import { getIndicatorsByShippingType } from "../services/app";

export const useIndicatorsByShippingType = (query: { organizationID: string, start: string, end: string }) => {
    const { data, isFetching } = useQuery({
        queryKey: [`indicators-shipping-type`, query.organizationID],
        queryFn: () => getIndicatorsByShippingType(query.organizationID, query.start, query.end),
    });

    return {
        data: data,
        isFetching
    };
};