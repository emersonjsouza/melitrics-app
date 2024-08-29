import React, { PropsWithChildren } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
} from 'react-native';
import { Order } from '../../services/app';
import { format, parseISO } from 'date-fns';
import { shipping_type } from '../../utils';

type CardProps = PropsWithChildren<{
  item: Order
}>

export default function ({ item }: CardProps): React.JSX.Element {

  const payment_type = {
    'paid': 'Aprovado',
    'cancelled': 'Cancelado',
  }

  const statusColor = item.status == "paid" ? '#03933B' : '#999'

  return (
    <View
      style={{ borderStartColor: statusColor, ...styles.cardContainer }}>
      <View>
        <Text style={styles.cardTitle}>{item.sku} - {item.title}</Text>
        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, color: '#9C9C9C' }}>R$ {item.net_income.toFixed(2)}</Text>
          <Text style={{ fontSize: 12, color: '#03933B', marginLeft: 2, }}>{((item.net_income / item.revenue) * 100).toFixed(2)}%</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 10, fontFamily: 'Robo-Thin', color: '#9C9C9C' }}>margem de contribuição</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
        <View style={{ borderWidth: .5, borderColor: '#9C9C9C', marginRight: 10, padding: 5, borderRadius: 10 }}>
          <Text style={{ fontSize: 10, color: '#9C9C9C' }}>{item.amount_unit} unid.</Text>
        </View>
        <View style={{ borderWidth: .5, borderColor: '#9C9C9C', marginRight: 10, padding: 5, borderRadius: 10 }}>
          <Text style={{ fontSize: 10, color: '#9C9C9C' }}>{shipping_type[item.shipping_type] ?? item.shipping_type}</Text>
        </View>
        <View style={{ borderWidth: .5, backgroundColor: statusColor, borderColor: statusColor, marginRight: 10, padding: 5, borderRadius: 10 }}>
          <Text style={{ fontSize: 10, color: '#fff' }}>{payment_type[item.status] ?? item.status}</Text>
        </View>
        <View style={{ borderWidth: .5, borderColor: '#9C9C9C', marginRight: 10, padding: 5, borderRadius: 10 }}>
          <Text style={{ fontSize: 10, color: '#9C9C9C' }}>{format(parseISO(item.created_at), 'dd/MM/yyyy - HH:mm:ss')}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 20,
    borderRadius: 20,
    justifyContent: 'space-between',
    borderColor: '#ccc',
    borderWidth: 1,
    borderStartWidth: 5,
    height: Platform.OS == 'android' ? 165 : 150, padding: 20,
    marginBottom: 10,
  },
  cardTitle: {
    width: '90%',
    fontSize: 12,
    color: '#212946',
    fontFamily: 'Roboto-Light',
  },
  cardUnitText: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Roboto-Thin',
  },
  cardTotalAmount: {
    fontFamily: 'Roboto-Medium',
    color: '#212946',
    fontSize: 15
  }
});
