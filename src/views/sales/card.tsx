import React, { PropsWithChildren, useRef } from 'react';
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
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '../../assets/color';
import Tax from '../ads/tax';


type CardProps = PropsWithChildren<{
  item: Order
  visibility?: boolean
  onRefresh?: () => void
}>

export default function ({ item: AdInfo, visibility, onRefresh }: CardProps): React.JSX.Element {
  const showDemoFlag = useFeatureFlag('show-demo')
  const payment_type = {
    'paid': 'Aprovado',
    'cancelled': 'Cancelado',
  }

  const taxModalRef = useRef<{ show: () => Promise<void> }>()

  let item = AdInfo

  if (showDemoFlag) {
    item.title = "Dummy Title"
    item.external_id = "MELICODE"
    item.sku = "SKU1"
  }

  const statusColor = item.status == "paid" ? '#03933B' : '#999'
  const sideStatusColor = item.status == "paid" ? (item.is_advertising ? '#ab86ff' : '#03933B') : '#999'


  let cardHeight = styles.cardContainer.height;
  if (item.is_advertising || item.cost > 0) {
    cardHeight += 25
  }

  if (item.cost == 0) {
    cardHeight += 30
  }

  return (
    <View
      style={{ borderStartColor: sideStatusColor, ...styles.cardContainer, height: cardHeight }}>
      <Tax ref={taxModalRef} externalItemID={item.external_item_id} defaultSku={item.sku} callback={onRefresh} />
      <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
        {item.is_advertising && <View style={{ flexDirection: 'row', borderColor: '#ddd', borderWidth: 0.5, marginLeft: 10, width: 120, marginBottom: 5, borderBottomStartRadius: 10, borderBottomEndRadius: 10, height: 25, justifyContent: 'center', alignItems: 'center' }}>
          <Image style={{ width: 20, height: 20, padding: 10 }}
            source={require('../../assets/images/logo-ads.png')} />
          <Text style={{ color: '#ab86ff', fontSize: 9, marginLeft: 10, fontWeight: 600 }}>com publicidade</Text>
        </View>}
        {item.cost > 0 && <View style={{ flexDirection: 'row', borderBlockColor: '#03933B', backgroundColor: '#03933B', borderWidth: 0.5, marginLeft: 10, width: 120, marginBottom: 5, borderBottomStartRadius: 10, borderBottomEndRadius: 10, height: 25, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 9, marginLeft: 10, fontWeight: 600 }}>Margem {formatToBRL(item.net_income)}</Text>
        </View>}
      </View>
      <View style={{ marginTop: 10 }}>
        {visibility && <Text style={styles.cardTitle}>{item.sku.toUpperCase()} - {item.title}</Text>}
        {!visibility && <Text style={styles.cardTitle}>{item.external_id}</Text>}
        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, color: '#9C9C9C' }}>{formatToBRL(item.revenue)}</Text>
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
      {item.cost == 0 && <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 4 }}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name={'alert'} color={'#fb8c00'} size={20} />
          <Text style={{ fontSize: 10, color: '#9C9C9C', marginLeft: 5 }}>produto sem definição de custo e imposto</Text>
        </View>
        <TouchableOpacity onPress={() => taxModalRef.current?.show()}>
          <View style={{ backgroundColor: Colors.TextColor, borderRadius: 10, margin: 5, padding: 5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'plus'} color={'#FFF'} size={20} />
            <Text style={{ color: '#FFF', fontSize: 8 }}>ADICIONAR CUSTO & IMPOSTO</Text>
          </View>
        </TouchableOpacity>
      </View>}
    </View >
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderStartWidth: 5,
    paddingTop: 0,
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
