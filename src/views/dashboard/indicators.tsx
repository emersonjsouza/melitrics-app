import React, { PropsWithChildren } from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import CardInsight from '../../components/card-insight';
import { Indicator } from '../../services/types';

type Props = PropsWithChildren<{
  isFetching: boolean
  data: Indicator | undefined
}>

export default function ({ isFetching, data }: Props): React.JSX.Element {

  const revenuePercent = isFetching ? 0 : (data?.net_income as number) / (data?.revenue as number) * 100

  return (<View style={{ height: 100, marginTop: 10 }}>
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ height: 100, marginTop: 20, marginLeft: 20, flexDirection: 'row' }}>
      <CardInsight
        title='Margem'
        isLoading={isFetching}
        amount={data?.net_income as number}
        amountInPercent={revenuePercent}
        backgroundColor='#27ae60'
      />
      <CardInsight
        isLoading={isFetching}
        title='Custos'
        amount={data?.cost as number}
        backgroundColor='#e67e22'
      />
      <CardInsight
        isLoading={isFetching}
        title='Tarifas'
        amount={data?.sales_fee as number + (data?.shipping_cost as number)}
        backgroundColor='#ffce00'
      />
      <CardInsight
        isLoading={isFetching}
        title='Impostos'
        amount={data?.tax as number}
        backgroundColor='#eb4d4b'
      />
    </ScrollView>
  </View>)
}