import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { format, subDays } from 'date-fns'
import { Dropdown } from 'react-native-element-dropdown';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import Card from './card';
import NavigationButton from '../../components/navigation-button';
import { Colors } from '../../assets/color';
import LottieView from 'lottie-react-native';
import { Modal } from '../../components/modal';
import Calendar from "react-native-calendar-range-picker";
import { CUSTOM_LOCALE } from '../../utils';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ({ navigation }: any): React.JSX.Element {
  const [dateSelect, setDateSelect] = useState('0')
  const [status, setStatus] = useState('')
  const [shippingType, setShippingType] = useState('')
  const { currentOrg, orderInfoVisibility, saveOrderInfoVisibility } = useAuth()
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const orderHook = useOrders({
    organizationID: currentOrg?.organization_id || '',
    start: startDate,
    end: endDate,
    status,
    shippingType
  })

  useEffect(() => {
    console.log('first time...', orderHook)
  }, [])

  let { data, total, isFetching, fetchNextPage, hasNextPage, refetch } = orderHook

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch()
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `(${total}) Vendas`,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <NavigationButton onPress={saveOrderInfoVisibility} icon={orderInfoVisibility ? 'eye-off-outline' : 'eye-outline'} />
        </View>
      )
    })
  }, [total, orderInfoVisibility])

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.mainContainer}>
      <StatusBar translucent barStyle="light-content" backgroundColor={Colors.Main} />

      <Modal isVisible={isModalVisible}>
        <Modal.Container>
          <Modal.Body>
            <View style={{ height: 360 }}>
              <Calendar
                locale={CUSTOM_LOCALE}
                startDate={startDate}
                endDate={endDate}
                initialNumToRender={1}
                onChange={({ startDate, endDate }) => {
                  if (startDate && endDate) {
                    setStartDate(startDate)
                    setEndDate(endDate)
                    setIsModalVisible(false)
                  }
                }}
              />
            </View>
          </Modal.Body>
          <Modal.Footer>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text>Fechar</Text>
            </TouchableOpacity>
          </Modal.Footer>
        </Modal.Container>
      </Modal>

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
              { label: 'Hoje', value: '0' },
              { label: 'Ontem', value: '1' },
              { label: 'Últimos 7 dias', value: '6' },
              { label: 'Últimos 15 dias', value: '14' },
              { label: 'Outro período', value: 'custom' },
            ]}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={dateSelect}
            onChange={({ value }: any) => {
              setDateSelect(value);
              if (value != "custom") {
                let startDate = subDays(new Date(), parseInt(value))
                setStartDate(format(startDate, 'yyyy-MM-dd'))

                if (value == '1') {
                  setEndDate(format(startDate, 'yyyy-MM-dd'))
                } else {
                  setEndDate(format(new Date(), 'yyyy-MM-dd'))
                }
              }
              else {
                setIsModalVisible(true)
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
            itemTextStyle={dropStyle.itemStyle}
            style={dropStyle.containerStyle}
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
      {total == 0 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <View style={{ width: 150, height: 150 }}>
          <LottieView
            source={require("../../assets/images/loading-data.json")}
            style={{ width: "100%", height: "100%" }}
            autoPlay
            loop
          />
        </View>
        <Text style={{ flexWrap: 'nowrap', textAlign: 'center', color: Colors.TextColor }}>
          Você não tem nenhuma venda registrada no momento
        </Text>
      </View>}

      {total > 0 && <FlatList
        data={data?.flatMap(x => x.items)} keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (<Card visibility={orderInfoVisibility} item={item} />)}
        onEndReached={(el) => {
          if (hasNextPage) {
            fetchNextPage()
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={< FooterListComponent isFetching={isFetching} />}
      />}
    </SafeAreaView >
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
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#fff'
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.Main,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 60
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
