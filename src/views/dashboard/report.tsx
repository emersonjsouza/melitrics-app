import React, { PropsWithChildren, forwardRef, useImperativeHandle } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Text,
  View
} from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { useIndicatorsByMonth } from '../../hooks/useIndicatorsByMonth';

type Props = PropsWithChildren<{
  organizationID: string
}>

export default forwardRef(({ organizationID }: Props, ref) => {
  const {
    isFetching,
    refetch,
    monthDataSet,
    monthRevenueDataSet
  } = useIndicatorsByMonth({ organizationID: organizationID })

  useImperativeHandle(ref, () => ({
    refresh: async () => {
      refetch()
    },
  }));

  return (<View style={{ alignItems: 'center', height: 250 }}>
    {isFetching && <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#999" />}
    {!isFetching && monthDataSet.length == 0 && <Text style={{color: '#ccc'}}>nenhum informação disponível</Text>}
    {!isFetching && monthDataSet.length > 0 && <LineChart
      data={{
        labels: monthDataSet,
        datasets: [
          {
            data: [
              ...monthRevenueDataSet
            ]
          }
        ]
      }}
      width={Dimensions.get("window").width - 50} // from react-native
      height={220}
      yAxisLabel=""
      yAxisSuffix="M"
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        backgroundColor: "#64FFD3",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#64FFD3",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#ffa726"
        },
        style: {
          padding: 100
        }
      }}
      bezier
      style={{
        marginVertical: 10,
        borderRadius: 16
      }}
    />}
  </View>)
})