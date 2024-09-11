import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { format, subDays } from 'date-fns'
import { Dropdown } from 'react-native-element-dropdown';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import Card from './card';
import NavigationButton from '../../components/navigation-button';
import { Colors } from '../../assets/color';

export default function ({ navigation }: any): React.JSX.Element {
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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch()
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
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
      <StatusBar translucent barStyle="light-content" backgroundColor={Colors.Main} />
      <View style={styles.headerContainer}>
        <View style={styles.filterButton}>
          <Dropdown
            iconColor='#fff'
            iconStyle={dropStyle.iconStyle}
            placeholderStyle={dropStyle.placeholderStyle}
            selectedTextStyle={dropStyle.selectedTextStyle}
            style={dropStyle.containerStyle}
            itemTextStyle={dropStyle.itemStyle}
            data={[
              {
                label: 'Hoje', value: '0',
              },
              { label: 'Ontem', value: '1' },
              { label: 'Últimos 7 dias', value: '6' },
              { label: 'Últimos 15 dias', value: '14' },
              { label: 'Últimos 30 dias', value: '29' },
            ]}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={dateSelect}
            onChange={({ value }: any) => {
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
          />
        </View>

        <View style={styles.filterButton}>
          <Dropdown
            iconColor='#fff'
            iconStyle={dropStyle.iconStyle}
            placeholderStyle={dropStyle.placeholderStyle}
            selectedTextStyle={dropStyle.selectedTextStyle}
            style={dropStyle.containerStyle}
            itemTextStyle={dropStyle.itemStyle}
            placeholder='Situação'
            data={[
              { label: 'Situação', value: '' },
              { label: 'Aprovadas', value: 'paid' },
              { label: 'Canceladas', value: 'cancelled' },
            ]}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={status}
            onChange={({ value }: any) => {
              setStatus(value);
            }}
          />
        </View>

        <View style={styles.filterButton}>
          <Dropdown
            iconColor='#fff'
            iconStyle={dropStyle.iconStyle}
            placeholderStyle={dropStyle.placeholderStyle}
            selectedTextStyle={dropStyle.selectedTextStyle}
            itemTextStyle={dropStyle.itemStyle}
            placeholder='Frete'
            style={dropStyle.containerStyle}
            data={[
              { label: 'Frete', value: '' },
              { label: 'FULL', value: 'fulfillment' },
              { label: 'Flex', value: 'self_service' },
              { label: 'Agencia/Correios', value: 'xd_drop_off' },
            ]}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={shippingType}
            onChange={({ value }: any) => {
              setShippingType(value);
            }}
          />
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

const dropStyle = StyleSheet.create({
  selectedTextStyle: { textAlign: 'center', color: '#fff', fontSize: 11 },
  placeholderStyle: { alignContent: 'flex-end', color: '#fff', fontSize: 11 },
  iconStyle: { alignItems: 'flex-start', width: 20, height: 20 },
  containerStyle: { width: Dimensions.get('screen').width / 3 - 20, height: 40, paddingRight: 10, justifyContent: 'center', alignItems: 'center' },
  itemStyle: { fontSize: 11 }
})

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
    paddingTop: 10
  },
  filterButton: {
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10
  },
  filterButtonText: {
    fontFamily: 'Robo-Light',
    color: '#FFF'
  }
});
