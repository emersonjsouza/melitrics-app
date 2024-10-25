import React, { PropsWithChildren } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Image,
} from 'react-native';
import { Ad } from '../../services/types';
import { formatToBRL, shipping_type } from '../../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFeatureFlag } from 'posthog-react-native';
import { Colors } from '../../assets/color';

type CardProps = PropsWithChildren<{
  item: Ad
  visibility?: boolean
  navigate: any
}>

export default function ({ item: AdInfo, visibility, navigate }: CardProps): React.JSX.Element {
  const showDemoFlag = useFeatureFlag('show-demo')

  const ad_status = {
    'paused': 'Pausado',
    'active': 'Ativo',
    'closed': 'Encerrado',
  }

  const ad_sub_status = {
    'out_of_stock': 'Sem estoque',
    'deleted': 'Excluido'
  }

  let item = AdInfo

  if (showDemoFlag) {
    item.title = "Dummy Title"
    item.external_id = "MELICODE"
    item.sku = "SKU1"
    item.thumbnail_link = "https://images.tcdn.com.br/img/img_prod/1187980/bone_nike_913011_010_preto_529_1_58670e86a64c0f25ab90c6db312d8c61.jpg"
  }

  const statusColor = item.status == "active" ? '#03933B' : '#999'
  const mcColor = item.net_income > 0 ? '#03933B' : 'orange'

  const current_status = ad_status[item.status] == ad_status.active ? 'Ativo' : (ad_sub_status[item.sub_status] ?? ad_status[item.status])

  let cardHeight = styles.cardContainer.height;
  if (item.catalog_enabled && item.catalog_status != "not_listed") {
    cardHeight += 25
  }

  return (
    <TouchableOpacity onPress={() => {
      navigate("Ad", { itemID: item.id })
    }}>
      <View
        style={{ borderStartColor: statusColor, ...styles.cardContainer, height: cardHeight }}>
        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
          {item.catalog_enabled && <View style={{ backgroundColor: '#00c1d4', width: 100, marginBottom: 5, borderBottomStartRadius: 10, borderBottomEndRadius: 10, height: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#FFF', fontSize: 9, fontWeight: 600 }}>Catalogo</Text>
          </View>}
          {shipping_type[item.logistic_type] == shipping_type.fulfillment && <View style={{ flexDirection: 'row', backgroundColor: '#ddd', marginLeft: 10, width: 100, marginBottom: 5, borderBottomStartRadius: 10, borderBottomEndRadius: 10, height: 20, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons name={'lightning-bolt'} color={'#43ba73'} size={20} />
            <Text style={{ color: '#43ba73', fontSize: 9, fontWeight: 600 }}>Full</Text>
          </View>}
        </View>

        <View style={!item.catalog_enabled ? { marginTop: 15, flexDirection: 'row' } : { flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Image style={{ height: 40, width: 40, padding: 10, borderRadius: 10 }} blurRadius={!visibility ? 10 : 0}
              source={{ uri: item.thumbnail_link.replace('http://', 'https://') }} />
            <View style={{ marginLeft: 20, flex: 1 }}>
              {visibility && <Text style={styles.cardTitle}>{item.sku.toUpperCase()}{item.sku && ' - '}{item.title}</Text>}
              {!visibility && <Text style={styles.cardTitle}>Titulo Indisponível</Text>}
              <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                <Text style={{ fontSize: 20, color: '#9C9C9C' }}>{formatToBRL(item.price)}</Text>
                {item.cost > 0 && <Text style={{ fontSize: 12, color: mcColor, marginLeft: 2, }}>(MC {formatToBRL(item.net_income)} - {((item.net_income / item.price) * 100).toFixed(2)}%)</Text>}
              </View>
            </View>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>

            <View>
              <MaterialCommunityIcons name={'chevron-right'} color={'#ddd'} size={30} />
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
          {item.flex_enabled && <View style={{ flexDirection: 'row', backgroundColor: statusColor, justifyContent: 'center', alignItems: 'center', marginRight: 10, padding: 5, borderRadius: 10 }}>
            <MaterialCommunityIcons name={'motorbike'} color={'#FFF'} size={10} />
            <Text style={{ marginLeft: 2, fontSize: 10, color: '#FFF' }}>Flex</Text>
          </View>}
          <View style={{ borderWidth: .5, borderColor: statusColor, backgroundColor: statusColor, marginRight: 10, padding: 5, borderRadius: 10 }}>
            <Text style={{ fontSize: 10, color: '#FFF' }}>{current_status}</Text>
          </View>
        </View>
        {(item.catalog_enabled && item.catalog_status == "competing") && <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
          <MaterialCommunityIcons name={'alert'} color={'#c0392b'} size={20} />
          <Text style={{ fontSize: 10, color: '#9C9C9C', marginLeft: 5 }}>você está perdendo no catalogo, ganhe por {formatToBRL(item.catalog_price_to_win)}</Text>
        </View>}
        {(item.catalog_enabled && item.catalog_status == "sharing_first_place") && <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
          <MaterialCommunityIcons name={'alert'} color={'#fb8c00'} size={20} />
          <Text style={{ fontSize: 10, color: '#9C9C9C', marginLeft: 5 }}>você está compartilhado no catalogo, ganhe por {formatToBRL(item.catalog_price_to_win)}</Text>
        </View>}
        {(item.catalog_enabled && item.catalog_status == "winning") && <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
          <MaterialCommunityIcons name={'check'} color={Colors.Green} size={20} />
          <Text style={{ fontSize: 10, color: '#9C9C9C', marginLeft: 5 }}>você está ganhando no catalogo</Text>
        </View>}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderStartWidth: 5,
    paddingTop: 0,
    height: Platform.OS == 'android' ? 175 : 160,
    padding: 20,
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
