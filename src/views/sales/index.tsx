import React, { useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { format, subDays } from 'date-fns'
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import Card from './card';
import NavigationButton from '../../components/navigation-button';
import RNPickerSelect from "react-native-picker-select";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../assets/color';

export default function (props: any): React.JSX.Element {
  const [dateSelect, setDateSelect] = useState('0')
  const [status, setStatus] = useState('')
  const [shippingType, setShippingType] = useState('')
  const { currentOrg, orderInfoVisibility, saveOrderInfoVisibility } = useAuth()
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))

  const { data, total, isFetching, fetchNextPage, hasNextPage, refetch } = useOrders({
    organizationID: currentOrg?.organization_id || '',
    start: startDate,
    end: endDate,
    status,
    shippingType
  })

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: `(${total}) Vendas`,
      headerLeft: () => {
        <View style={{ flexDirection: 'row' }}>
          <NavigationButton onPress={saveOrderInfoVisibility} icon={'refresh'} />
        </View>
      },
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <NavigationButton onPress={saveOrderInfoVisibility} icon={orderInfoVisibility ? 'eye-off-outline' : 'eye-outline'} />
        </View>
      )
    })
  }, [total, orderInfoVisibility])

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent barStyle="light-content" backgroundColor={'#7994F5'} />
      <View style={styles.headerContainer}>
        <View style={styles.filterButton}>
          <RNPickerSelect
            key={dateSelect}
            value={dateSelect}
            placeholder={{ label: 'Período', value: '' }}
            doneText='Filtrar'
            style={{ placeholder: { color: '#FFF' }, inputAndroid: { color: '#FFF' }, inputIOS: { color: '#FFF' } }}
            onValueChange={(value) => {
              setDateSelect(value);
              if (value) {
                let startDate = subDays(new Date(), parseInt(value))
                setStartDate(format(startDate, 'yyyy-MM-dd'))

                if (value == '1') {
                  setEndDate(format(startDate, 'yyyy-MM-dd'))
                }
                else {
                  setEndDate(format(new Date(), 'yyyy-MM-dd'))
                }
              }
            }}
            items={[
              { label: 'Hoje', value: '0' },
              { label: 'Ontem', value: '1' },
              { label: 'Últimos 7 dias', value: '6' },
              { label: 'Últimos 15 dias', value: '14' },
              { label: 'Últimos 30 dias', value: '29' },
            ]}
          />
          <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
        </View>
        <View style={styles.filterButton}>
          <RNPickerSelect
            style={{ placeholder: { color: '#FFF' }, inputAndroid: { color: '#FFF' }, inputIOS: { color: '#FFF' } }}
            key={status}
            value={status}
            placeholder={{ label: 'Situação da venda', value: '' }}
            doneText='Filtrar'
            onValueChange={value => setStatus(value)}
            items={[
              { label: 'Aprovadas', value: 'paid' },
              { label: 'Canceladas', value: 'cancelled' },
            ]}
          />
          <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
        </View>

        <View style={styles.filterButton}>
          <RNPickerSelect
            style={{ placeholder: { color: '#FFF' }, inputAndroid: { color: '#FFF' }, inputIOS: { color: '#FFF' } }}
            key={shippingType}
            value={shippingType}
            placeholder={{ label: 'Tipo de Frete', value: '' }}
            doneText='Filtrar'
            onValueChange={value => setShippingType(value)}
            items={[
              { label: 'Todas', value: '' },
              { label: 'FULL', value: 'fulfillment' },
              { label: 'Flex', value: 'self_service' },
              { label: 'Agencia/Correios', value: 'xd_drop_off' },
            ]}
          />
          <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
        </View>
      </View>
      <FlatList style={styles.ordersContainer}
        data={data?.flatMap(x => x.items)} keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (<Card visibility={orderInfoVisibility} item={item} />)}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage()
          }
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={<FooterListComponent isFetching={isFetching} />}
      />
    </View>
  )
}

const FooterListComponent = ({ isFetching }: any) => {
  if (!isFetching)
    return null

  return <View style={{ padding: 10 }}>
    <ActivityIndicator size={25} color={'#7994F5'} />
  </View>
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.Main,
    paddingTop: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 60
  },
  ordersContainer: {
    paddingTop: 10,
    paddingHorizontal: 5
  },
  filterButton: {
    flexDirection: 'row',
    borderRadius: 5,
    padding: 10
  },
  filterButtonText: {
    fontFamily: 'Robo-Light',
    color: '#FFF'
  }
});
