import React, { PropsWithChildren, useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ad } from '../../services/types';
import { formatToBRL, shipping_type } from '../../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardInsight from '../../components/card-insight';

type CardProps = PropsWithChildren<{
  item: Ad
  visibility?: boolean
  navigate: any
}>

export default function ({ route, navigation }: any) {
  const item = route?.params.item as Ad

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

  const current_status = ad_status[item.status] == ad_status.active ? 'Ativo' : (ad_sub_status[item.sub_status] ?? ad_status[item.status])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Informações do Produto`,
    })
  }, [])

  return (<View
    style={styles.cardContainer}>
    <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
      {item.catalog_enabled && <View style={{ backgroundColor: '#00c1d4', width: 100, marginBottom: 5, borderBottomStartRadius: 10, borderBottomEndRadius: 10, height: 25, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 600 }}>Catalogo</Text>
      </View>}
      {shipping_type[item.logistic_type] == shipping_type.fulfillment && <View style={{ flexDirection: 'row', backgroundColor: '#ddd', marginLeft: 10, width: 100, marginBottom: 5, borderBottomStartRadius: 10, borderBottomEndRadius: 10, height: 25, justifyContent: 'center', alignItems: 'center' }}>
        <MaterialCommunityIcons name={'lightning-bolt'} color={'#43ba73'} size={20} />
        <Text style={{ color: '#43ba73', fontSize: 10, fontWeight: 600 }}>Full</Text>
      </View>}
    </View>

    <View style={{ marginTop: 20 }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
        <Image style={{ height: 160, width: 160, borderRadius: 10, resizeMode: 'contain' }}
          source={{ uri: item.thumbnail_link.replace('http://', 'https://').replace('-I.', '-O.') }} />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: '#718093', textAlign: 'center' }}>{formatToBRL(item.price)}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.cardSubText}><MaterialCommunityIcons name={'barcode-scan'} color={'#c2c2c2'} size={12} /> SKU: {item.sku.toUpperCase()}{!item.sku && ' - '}</Text>
            <Text style={styles.cardSubText}><MaterialCommunityIcons name={'barcode-scan'} color={'#c2c2c2'} size={12} /> {item.external_id}</Text>
          </View>
        </View>
      </View>
    </View>
    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-start' }}>
      <View style={{ borderWidth: .5, borderColor: '#718093', marginRight: 10, padding: 5, borderRadius: 10 }}>
        <Text style={{ fontSize: 10, color: '#718093' }}>{item.available_quantity} disponível</Text>
      </View>
      <View style={{ borderWidth: .5, borderColor: '#718093', marginRight: 10, padding: 5, borderRadius: 10 }}>
        <Text style={{ fontSize: 10, color: '#718093' }}>{item.sold_quantity} vendas</Text>
      </View>
      {item.flex_enabled && <View style={{ flexDirection: 'row', backgroundColor: statusColor, justifyContent: 'center', alignItems: 'center', marginRight: 10, padding: 5, borderRadius: 10 }}>
        <MaterialCommunityIcons name={'motorbike'} color={'#FFF'} size={10} />
        <Text style={{ marginLeft: 2, fontSize: 10, color: '#FFF' }}>Flex</Text>
      </View>}
      <View style={{ borderWidth: .5, borderColor: statusColor, backgroundColor: statusColor, marginRight: 10, padding: 5, borderRadius: 10 }}>
        <Text style={{ fontSize: 10, color: '#FFF' }}>{current_status}</Text>
      </View>
    </View>
    {item.cost == 0 && <TouchableOpacity>
      <View style={{ backgroundColor: '#ffce00', borderRadius: 10, margin: 10, padding: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <MaterialCommunityIcons name={'plus'} color={'#FFF'} size={20} />
        <Text style={{ color: '#FFF' }}>ADICIONAR CUSTO E IMPOSTO</Text>
      </View>
    </TouchableOpacity>}
    {item.cost == 0 && <View style={{ alignItems: 'center', padding: 5, marginHorizontal: 10, borderRadius: 5, alignContent: 'center' }}>
      <Text style={{ width: Dimensions.get('screen').width * 0.80, flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center', color: '#ddd' }}>Para sua margem ser mais precisa,  cadastre o custo do produto e aliquota de imposto da sua empresa</Text>
    </View>}
    <View style={{ height: 100, marginTop: 10 }}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ height: 100, flexDirection: 'row' }}>
        <CardInsight
          title='Margem'
          amount={item.net_income}
          amountInPercent={item.net_income / item.price * 100}
          backgroundColor='#B0FF6D'
        />
        <CardInsight
          title='Custos + Impostos'
          amount={item.cost}
          amountSub={item.tax_rate}
          backgroundColor='#64FFD3'
        />
        <CardInsight
          title='Tarifas'
          amount={item.sales_fee}
          backgroundColor='#ffce00'
        />
        {item.shipping_cost > 0 && <CardInsight
          title='Frete Vendedor'
          amount={item.shipping_cost}
          backgroundColor='#a471cc'
        />}
      </ScrollView>
    </View>
  </View>)
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingTop: 0,
    height: Platform.OS == 'android' ? 165 : 150,
    padding: 5,
    marginBottom: 10,
    backgroundColor: '#FFF',
    flex: 1
  },
  cardTitle: {
    width: '90%',
    fontSize: 18,
    color: '#718093',
    fontFamily: 'Roboto-Light',
  },
  cardSubText: {
    fontSize: 12,
    color: '#718093',
    fontFamily: 'Roboto-Thin',
  },
  cardTotalAmount: {
    fontFamily: 'Roboto-Regular',
    color: '#212946',
    fontSize: 15
  }
});
