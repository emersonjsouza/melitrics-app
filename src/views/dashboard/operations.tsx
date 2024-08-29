import React, { PropsWithChildren, forwardRef, useImperativeHandle } from 'react';
import {
  ActivityIndicator,
  View
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

  return (<View
    style={{ marginTop: 20, marginLeft: 20, flexDirection: 'column' }}>
    {isFetching && <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#999" />}
    {!isFetching && data?.map((item, index) => (<CardTiny key={index}
      title={shipping_type[item.shipping_type] ?? item.shipping_type}
      amount={item.revenue}
      amount_sold={item.amount_sold}
    />))}
  </View>)
})