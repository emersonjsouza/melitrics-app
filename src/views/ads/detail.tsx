import React, { PropsWithChildren, useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { Ad } from '../../services/types';
import { formatToBRL, shipping_type } from '../../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PieChart } from "react-native-gifted-charts";
import { Colors } from '../../assets/color';
import NavigationButton from '../../components/navigation-button';
import { useAuth } from '../../context/AuthContext';

type CardProps = PropsWithChildren<{
  item: Ad
  visibility?: boolean
  navigate: any
}>

export default function ({ route, navigation }: any) {
  const { adInfoVisibility, saveAdInfoVisibility } = useAuth()

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
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <NavigationButton onPress={saveAdInfoVisibility} icon={adInfoVisibility ? 'eye-off-outline' : 'eye-outline'} />
        </View>
      )
    })
  }, [adInfoVisibility])

  const pieData = [
    {
      value: item.net_income,
      color: '#B0FF6D',
      gradientCenterColor: '#B0FF6D',
      focused: true,
    },
    { value: item.sales_fee, color: '#ffce00', gradientCenterColor: '#ffce00' },
    { value: item.cost, color: '#8F80F3', gradientCenterColor: '#8F80F3' },
    { value: item.tax_rate, color: '#fb8c00', gradientCenterColor: '#fb8c00' },
    { value: item.shipping_cost, color: '#a471cc', gradientCenterColor: '#a471cc' },
  ];

  const renderDot = (color: any) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderLegendComponent = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            {renderDot('#8F80F3')}
            <Text style={{ color: 'white' }}>Custo {formatToBRL(item.cost)}</Text>
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            {renderDot('#a471cc')}
            <Text style={{ color: 'white' }}>Frete {formatToBRL(item.shipping_cost)}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20,
            }}>
            {renderDot('#ffce00')}
            <Text style={{ color: 'white' }}>Tarifa {formatToBRL(item.sales_fee)}</Text>
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            {renderDot('#fb8c00')}
            <Text style={{ color: 'white' }}>Imposto {formatToBRL(item.tax_rate)}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 160,
              marginTop: 5,
            }}>
            {renderDot('#B0FF6D')}
            <Text style={{ color: 'white' }}>Margem {formatToBRL(item.net_income)}</Text>
          </View>
        </View>
      </>
    );
  };

  return (<View style={styles.cardContainer}>
    <ScrollView>
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
        {/* <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
          {adInfoVisibility && <Image style={{ height: 160, width: 160, borderRadius: 10, resizeMode: 'contain' }}
            source={{ uri: item.thumbnail_link.replace('http://', 'https://').replace('-I.', '-O.') }} />}
        </View> */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.cardTitle}>{adInfoVisibility ? item.title : 'Informação indisponível'}</Text>
            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, color: '#718093', textAlign: 'center' }}>{formatToBRL(item.price)}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.cardSubText}>SKU: {adInfoVisibility ? item.sku.toUpperCase() : ''}{!item.sku && ' - '}</Text>
              <Text style={styles.cardSubText}><MaterialCommunityIcons name={'barcode-scan'} color={'#c2c2c2'} size={12} /> {adInfoVisibility ? item.external_id : '-'}</Text>
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
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            margin: 10,
            padding: 16,
            borderRadius: 20,
            backgroundColor: Colors.Main,
          }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            Desempenho do Anúncio
          </Text>
          <View style={{ padding: 20, alignItems: 'center' }}>
            <PieChart
              data={pieData}
              donut
              showGradient
              sectionAutoFocus
              radius={100}
              innerRadius={60}
              innerCircleColor={Colors.Main}
              centerLabelComponent={() => {
                return (
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text
                      style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
                      {((item.net_income / item.price) * 100).toFixed(2)}%
                    </Text>
                    <Text style={{ fontSize: 14, color: 'white' }}>MARGEM</Text>
                  </View>
                );
              }}
            />
          </View>
          {renderLegendComponent()}
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Tax', { item_id: item.id, taxID: item.taxID })}>
        <View style={{ backgroundColor: Colors.Main, borderRadius: 10, margin: 10, padding: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <MaterialCommunityIcons name={'plus'} color={'#FFF'} size={20} />
          {item.cost == 0 && <Text style={{ color: '#FFF' }}>ADICIONAR CUSTO E IMPOSTO</Text>}
          {item.cost > 0 && <Text style={{ color: '#FFF' }}>ATUALIZAR CUSTO E IMPOSTO</Text>}
        </View>
      </TouchableOpacity>
    </ScrollView>
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
