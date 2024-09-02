import { useQuery } from "@tanstack/react-query";
import { getIndicatorsByMonth } from "../services";

export const useIndicatorsByMonth = (query: { organizationID: string }) => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: [`indicators-month`, query.organizationID],
    queryFn: () => getIndicatorsByMonth(query.organizationID),
    enabled: !!query.organizationID
  });

  const formatRevenue = (revenue: number) => {
    const magnitude = Math.floor(Math.log10(revenue) / 3);

    const scaledRevenue = (revenue / Math.pow(1000, magnitude))
    return scaledRevenue
  }

  const month_dict = {
    1: "Jan",
    2: "Fev",
    3: "Mar",
    4: "Abr",
    5: "Mai",
    6: "Jun",
    7: "Jul",
    8: "Ago",
    9: "Set",
    10: "Out",
    11: "Nov",
    12: "Dez"
  }

  const monthDataSet: string[] = []
  const monthRevenueDataSet: number[] = []

  if (!isFetching) {
    const months = data?.map((item) => item.month) as number[] || []
    const latestMonth = Math.max(...months)

    let maxMonth = 6;
    for (let index = latestMonth; index > 0; index--) {
      const item = data?.find(x => x.month == index)
      monthDataSet.push(month_dict[index as keyof typeof month_dict])
      monthRevenueDataSet.push(formatRevenue(item?.revenue as number))
      if (maxMonth > 1) {
        maxMonth -= 1
      }
      else {
        break
      }
    }
  }

  monthDataSet.reverse()
  monthRevenueDataSet.reverse()

  return {
    monthDataSet,
    monthRevenueDataSet,
    isFetching,
    refetch
  };
};