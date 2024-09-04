import React, { PropsWithChildren } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Image,
} from 'react-native';
import { Ad } from '../../services/types';
import { shipping_type } from '../../utils';

type CardProps = PropsWithChildren<{
  item: Ad
  visibility?: boolean
}>

export default function ({ item, visibility }: CardProps): React.JSX.Element {
  const ad_status = {
    'paused': 'Pausado',
    'active': 'Ativo',
    'closed': 'Encerrado',
  }

  const ad_sub_status = {
    'out_of_stock': 'Sem estoque',
    'deleted': 'Excluido'
  }

  const statusColor = item.status == "active" ? '#03933B' : '#999'
  const healthColor = item.health >= 0.75 ? '#03933B' : 'orange'

  const current_status = ad_status[item.status] == ad_status.active ? 'Ativo' : (ad_sub_status[item.sub_status] ?? ad_status[item.status])

  return (
    <View
      style={{ borderStartColor: statusColor, ...styles.cardContainer }}>
      <View style={{ flexDirection: 'row', }}>
        <Image style={{ height: 40, width: 40, padding: 10, borderRadius: 10 }} blurRadius={!visibility ? 10 : 0}
          source={{ uri: item.thumbnail_link.replace('http://', 'https://') }} />
        <View style={{ marginLeft: 20, flex: 1 }}>
          {visibility && <Text style={styles.cardTitle}>{item.sku.toUpperCase()}{item.sku && ' - '}{item.title}</Text>}
          {!visibility && <Text style={styles.cardTitle}>{item.external_id}</Text>}
          <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: '#9C9C9C' }}>R$ {item.price.toFixed(2)}</Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
        <View style={{ borderWidth: .5, borderColor: '#9C9C9C', marginRight: 10, padding: 5, borderRadius: 10 }}>
          <Text style={{ fontSize: 10, color: '#9C9C9C' }}>{item.available_quantity} disponível</Text>
        </View>
        <View style={{ borderWidth: .5, borderColor: '#9C9C9C', marginRight: 10, padding: 5, borderRadius: 10 }}>
          <Text style={{ fontSize: 10, color: '#9C9C9C' }}>{item.sold_quantity} vendas</Text>
        </View>
        <View style={{ borderWidth: .5, borderColor: '#9C9C9C', marginRight: 10, padding: 5, borderRadius: 10 }}>
          <Text style={{ fontSize: 10, color: '#9C9C9C' }}>{shipping_type[item.logistic_type] ?? item.logistic_type}</Text>
        </View>
        <View style={{ borderWidth: .5, borderColor: statusColor, backgroundColor: statusColor, marginRight: 10, padding: 5, borderRadius: 10 }}>
          <Text style={{ fontSize: 10, color: '#FFF' }}>{current_status}</Text>
        </View>
        <View style={{ borderWidth: .5, borderColor: healthColor, marginRight: 10, padding: 5, borderRadius: 10 }}>
          <Text style={{ fontSize: 10, color: healthColor }}>{item.health * 100}%</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {

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
