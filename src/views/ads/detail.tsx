import React, { useEffect, useLayoutEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { formatToBRL, shipping_type } from '../../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PieChart } from "react-native-gifted-charts";
import { Colors } from '../../assets/color';
import NavigationButton from '../../components/navigation-button';
import { useAuth } from '../../context/AuthContext';
import { useAd } from '../../hooks/useAd';
import { useFeatureFlag } from 'posthog-react-native';
import { StatusBar } from 'react-native';
import Tax from './tax';
import LottieView from 'lottie-react-native';

export default function ({ route, navigation }: any) {
  const { adInfoVisibility, saveAdInfoVisibility, currentOrg } = useAuth()
  const showDemoFlag = useFeatureFlag('show-demo')
  const itemID = route?.params.itemID
  const taxModalRef = useRef<{ show: () => Promise<void> }>()

  const { item: AdInfo, isFetching, refetch } = useAd({
    organizationID: currentOrg?.organization_id,
    id: itemID
  })

  let item = AdInfo

  if (showDemoFlag) {
    item.title = "Dummy Title"
    item.external_id = "MELICODE"
    item.sku = "SKU1"
    item.thumbnail_link = "https://images.tcdn.com.br/img/img_prod/1187980/bone_nike_913011_010_preto_529_1_58670e86a64c0f25ab90c6db312d8c61.jpg"
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.tax) {
        refetch()
      }
    });

    return unsubscribe;
  }, [navigation, route.params?.tax]);

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

  const current_status = ad_status[item.status] == ad_status.active ? 'Ativo' : (ad_sub_status[item?.sub_status] ?? ad_status[item?.status])

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
      value: item.net_income > 0 ? item.net_income : 0,
      color: Colors.Green,
      gradientCenterColor: Colors.Green,
      focused: true,
    },
    { value: item.sales_fee, color: '#ffce00', gradientCenterColor: '#ffce00' },
    { value: item.cost, color: '#c0392b', gradientCenterColor: '#8F80F3' },
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
            {renderDot('#c0392b')}
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
            {renderDot(Colors.Green)}
            <Text style={{ color: 'white' }}>Margem {formatToBRL(item.net_income)}</Text>
          </View>
        </View>
      </>
    );
  };

  return (<View style={{ ...styles.cardContainer }}>
    <StatusBar translucent barStyle="light-content" backgroundColor={Colors.Main} />
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {!isFetching && <><View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
        {item.catalog_enabled && <View style={{ backgroundColor: '#00c1d4', width: 100, marginBottom: 5, borderBottomStartRadius: 10, borderBottomEndRadius: 10, height: 25, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 600 }}>Catalogo</Text>
        </View>}
        {shipping_type[item.logistic_type] == shipping_type.fulfillment && <View style={{ flexDirection: 'row', backgroundColor: '#ddd', marginLeft: 10, width: 100, marginBottom: 5, borderBottomStartRadius: 10, borderBottomEndRadius: 10, height: 25, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialCommunityIcons name={'lightning-bolt'} color={'#43ba73'} size={20} />
          <Text style={{ color: '#43ba73', fontSize: 10, fontWeight: 600 }}>Full</Text>
        </View>}
      </View>
        <Tax ref={taxModalRef} defaultSku={item.sku} itemID={item.id} taxID={item.tax_id} />
        <View style={{ marginTop: 20 }}>
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
        <View>
          <View
            style={{
              margin: 10,
              padding: 16,
              borderRadius: 20,
              backgroundColor: Colors.TextColor,
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
                innerCircleColor={Colors.TextColor}
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
        <TouchableOpacity onPress={() => taxModalRef.current?.show()}>
          <View style={{ backgroundColor: Colors.TextColor, borderRadius: 10, margin: 10, padding: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'plus'} color={'#FFF'} size={20} />
            {item.cost == 0 && <Text style={{ color: '#FFF' }}>ADICIONAR CUSTO E IMPOSTO</Text>}
            {item.cost > 0 && <Text style={{ color: '#FFF' }}>ATUALIZAR CUSTO E IMPOSTO</Text>}
          </View>
        </TouchableOpacity></>}
      {isFetching &&
        <>
          <View style={{ flexGrow: 100, flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <View style={{ width: 150, height: 150 }}>
              <LottieView
                source={require("../../assets/images/loading-data.json")}
                style={{ width: "100%", height: "100%" }}
                autoPlay
                loop
              />
            </View>
            <Text style={{ flexWrap: 'nowrap', textAlign: 'center', color: Colors.TextColor }}>
              carregando suas informações...
            </Text>
          </View>
        </>}

    </ScrollView >
  </View >)
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingTop: 0,
    padding: 5,
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
