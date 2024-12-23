import React, { PropsWithChildren, forwardRef, useImperativeHandle } from 'react';
import {
  ActivityIndicator,
  View,
  Text
} from 'react-native';

import CardTiny from '../../components/card-tiny';
import { useIndicatorsByShippingType } from '../../hooks/useIndicatorByShippingType';
import { shipping_type } from '../../utils';


type Props = PropsWithChildren<{
  startDate: string
  endDate: string
  organizationID: string
}>

export default forwardRef(({ organizationID, startDate, endDate }: Props, ref) => {
  const {
    isFetching,
    refetch: refetchShippingType,
    data
  } = useIndicatorsByShippingType({ organizationID: organizationID, start: startDate, end: endDate })

  useImperativeHandle(ref, () => ({
    refresh: async () => {
      refetchShippingType()
    },
  }));

  return (
    <>
      <Text style={{
        fontFamily: 'Roboto-Medium',
        marginTop: 20,
        color: '#212946',
        fontSize: 18,
        marginLeft: 20,
      }}>Minhas Operações</Text>

      <View
        style={{ marginTop: 20, marginLeft: 20, flexDirection: 'column' }}>


        {isFetching && <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#999" />}
        {!isFetching && data?.map((item, index) => (<CardTiny key={index}
          title={shipping_type[item.shipping_type] ?? item.shipping_type}
          amount={item.revenue}
          amount_sold={item.amount_sold}
          amount_unit={item.amount_unit_sold}
        />))}
      </View>
    </>)
})