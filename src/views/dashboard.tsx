import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ContentLoader, { Rect } from 'react-content-loader/native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LineChart } from "react-native-chart-kit";
import CardTiny from '../components/card-tiny';
import CardInsight from '../components/card-insight';
import { useIndicators } from '../hooks/useIndicators';
import { useIndicatorsByShippingType } from '../hooks/useIndicatorByShippingType';
import { useIndicatorsByMonth } from '../hooks/useIndicatorsByMonth';
import { useAuth } from '../context/AuthContext';

export default function (props: any): React.JSX.Element {
  const { logout, userData } = useAuth()

  const orgID = 'cb2a3984-1d36-4435-94b0-32c5cbc2b8fc'

  const [startDate, setStartDate] = useState<string>('2024-08-27')
  const [endDate, setEndDate] = useState<string>('2024-08-27')

  const { isFetching, data: indicators } = useIndicators({ organizationID: orgID, start: startDate, end: endDate, enableFetching: !!userData })
  const { isFetching: isFetchingShippingType, data: indicatorsShippingType } = useIndicatorsByShippingType({ organizationID: orgID, start: startDate, end: endDate, enableFetching: !!userData })
  const { isFetching: isFetchingMonth, monthDataSet, monthRevenueDataSet } = useIndicatorsByMonth({ organizationID: orgID, enableFetching: !!userData })

  const revenuePercent = isFetching ? 0 : (indicators?.net_income as number) / (indicators?.revenue as number) * 100

  useEffect(() => {
    if (props.route.params?.dateRange) {
      const { start, end } = props.route.params?.dateRange
      setStartDate(start)
      setEndDate(end)
    }
  }, [props.route.params?.dateRange]);

  const shipping_type = {
    'fulfillment': 'FULL',
    'xd_drop_off': 'Agencia',
    'self_service': 'Flex'
  }

  const onSignOut = async () => {
    logout(() => {
      props.navigation.navigate('App')
    })
  }

  const performFilter = () => {
    props.navigation.navigate('Dashboard-Filter')
  }

  return (
    <View style={{ flex: 1, flexGrow: 1, backgroundColor: '#FFF' }}>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#FFF'} />
      <ScrollView
        contentContainerStyle={styles.mainContainer}
        showsVerticalScrollIndicator={true}
        contentInsetAdjustmentBehavior="automatic">

        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.profileContainer}>
              <Text style={styles.profileText}>DM</Text>
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingSubText}>Seja bem vindo,</Text>
              {userData && <Text style={styles.greetingText}>{userData.name}</Text>}
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={onSignOut}>
              <MaterialCommunityIcons name={'logout'} color={'#8D8E8D'} size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: 10, marginLeft: 20 }}>
          <View style={styles.profitContainer}>
            <View>
              <Text style={{ fontFamily: 'Robo-Light' }}>Seu Faturamento</Text>
              {!isFetching && <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 25, marginTop: 2 }}>R$ {indicators?.revenue.toFixed(2)}</Text>}
              {isFetching && <ContentLoader
                height={20}
                speed={1}
                backgroundColor={'#999'}
                foregroundColor={'#ccc'}
                viewBox="0 0 380 60">
                <Rect x="0" y="40" rx="3" ry="10" width="380" height="500" />
              </ContentLoader>}
            </View>
            <TouchableOpacity onPress={() => performFilter()}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontFamily: 'Robo-Light', color: '#222222' }}>7 dias</Text>
                <MaterialCommunityIcons name={'menu-down'} color={'#222222'} size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 100, marginTop: 10 }}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ height: 100, marginTop: 20, marginLeft: 20, flexDirection: 'row' }}>
            <CardInsight
              title='Margem'
              isLoading={isFetching}
              amount={indicators?.net_income as Number}
              amountInPercent={revenuePercent}
              backgroundColor='#B0FF6D'
            />
            <CardInsight
              isLoading={isFetching}
              title='Custos + Impostos'
              amount={indicators?.cost as Number}
              amountSub={indicators?.tax as Number}
              backgroundColor='#64FFD3'
            />
            <CardInsight
              isLoading={isFetching}
              title='Tarifas'
              amount={indicators?.sales_fee as Number}
              backgroundColor='#ffce00'
            />
            <CardInsight
              isLoading={isFetching}
              title='Frete Vendedor'
              amount={indicators?.shipping_cost as Number}
              backgroundColor='#a471cc'
            />
            <CardInsight
              isLoading={isFetching}
              title='Ticket Médio'
              amount={indicators?.ticket_ratio as Number}
              backgroundColor='#7994F5'
            />
          </ScrollView>
        </View>

        <Text style={{
          fontFamily: 'Roboto-Medium',
          marginTop: 20,
          color: '#212946',
          fontSize: 18,
          marginLeft: 20,
        }}>Minhas Operações</Text>
        <View
          style={{ marginTop: 20, marginLeft: 20, flexDirection: 'column' }}>
          {isFetchingShippingType && <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#999" />}
          {!isFetchingShippingType && indicatorsShippingType?.map((item, index) => (<CardTiny key={index}
            title={shipping_type[item.shipping_type] ?? item.shipping_type}
            amount={item.revenue}
            unit={item.amount_unit_sold}
          />))}
        </View>

        <View style={{ alignItems: 'center', height: 250 }}>
          {isFetchingMonth && <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#999" />}
          {!isFetchingMonth && <LineChart
            data={{
              labels: monthDataSet,
              datasets: [
                {
                  data: [
                    ...monthRevenueDataSet
                  ]
                }
              ]
            }}
            width={Dimensions.get("window").width - 50} // from react-native
            height={220}
            yAxisLabel=""
            yAxisSuffix="M"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#64FFD3",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#64FFD3",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              },
              style: {
                padding: 100
              }
            }}
            bezier
            style={{
              marginVertical: 10,
              borderRadius: 16
            }}
          />}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: Platform.OS == 'android' ? 40 : 20,
    flexGrow: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginStart: 20,
    marginEnd: 20,
  },
  profileContainer: {
    backgroundColor: '#222222',
    width: 45, height: 45,
    padding: 2,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    alignSelf: 'center',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#FFF'
  },
  greetingContainer: {
    marginLeft: 5,
    alignContent: 'center'
  },
  profitContainer: {
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginStart: 20,
    marginEnd: 20,
  },
  greetingSubText: {
    color: '#718093',
    fontFamily: 'Roboto-Thin',
  },
  greetingText: {
    color: '#2f3640',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});
