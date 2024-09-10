import React, { PropsWithChildren } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Image,

} from 'react-native';
import { Order } from '../../services/types';
import { format, parseISO } from 'date-fns';
import { formatToBRL, shipping_type } from '../../utils';
import { useFeatureFlag } from 'posthog-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type CardProps = PropsWithChildren<{
  item: Order
  visibility?: boolean
}>

export default function ({ item: AdInfo, visibility }: CardProps): React.JSX.Element {
  const showDemoFlag = useFeatureFlag('show-demo')
  const payment_type = {
    'paid': 'Aprovado',
    'cancelled': 'Cancelado',
  }

  let item = AdInfo

  if (showDemoFlag) {
    item.title = "Dummy Title"
    item.external_id = "MELICODE"
    item.sku = "SKU1"
  }

  const statusColor = item.status == "paid" ? '#03933B' : '#999'

  return (
    <View
      style={{ borderStartColor: statusColor, ...styles.cardContainer, height: (item.cost == 0 ? (styles.cardContainer.height + 15) : styles.cardContainer.height) }}>
      <View>
        {visibility && <Text style={styles.cardTitle}>{item.sku.toUpperCase()} - {item.title}</Text>}
        {!visibility && <Text style={styles.cardTitle}>{item.external_id}</Text>}
        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, color: '#9C9C9C' }}>{formatToBRL(item.net_income)}</Text>
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
        {item.is_advertising && <View style={{ marginRight: 10 }}>
          <Image style={{ width: 20, height: 20, padding: 10 }}
            source={require('../../assets/images/logo-ads.png')} />
        </View>}
      </View>
      {item.cost == 0 && <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
        <MaterialCommunityIcons name={'alert'} color={'#fb8c00'} size={20} />
        <Text style={{ fontSize: 10, color: '#9C9C9C', marginLeft: 5 }}>produto sem definição de custo e imposto</Text>
      </View>}
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderStartWidth: 5,
    paddingTop: 10,
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
