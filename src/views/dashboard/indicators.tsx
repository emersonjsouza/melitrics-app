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
        amount={data?.net_income as Number}
        amountInPercent={revenuePercent}
        backgroundColor='#B0FF6D'
      />
      <CardInsight
        isLoading={isFetching}
        title='Custos + Impostos'
        amount={data?.cost as Number}
        amountSub={data?.tax as Number}
        backgroundColor='#64FFD3'
      />
      <CardInsight
        isLoading={isFetching}
        title='Tarifas'
        amount={data?.sales_fee as Number}
        backgroundColor='#ffce00'
      />
      <CardInsight
        isLoading={isFetching}
        title='Frete Vendedor'
        amount={data?.shipping_cost as Number}
        backgroundColor='#a471cc'
      />
      <CardInsight
        isLoading={isFetching}
        title='Ticket Médio'
        amount={data?.ticket_ratio as Number}
        backgroundColor='#7994F5'
      />
    </ScrollView>
  </View>)
}