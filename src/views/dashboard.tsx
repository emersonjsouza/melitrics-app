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

export default function (): React.JSX.Element {

  const orgID = 'cb2a3984-1d36-4435-94b0-32c5cbc2b8fc'
  const start = '2024-08-01'
  const end = '2024-08-31'

  const { isFetching, data: indicators } = useIndicators({ organizationID: orgID, start, end })
  const { isFetching: isFetchingShippingType, data: indicatorsShippingType } = useIndicatorsByShippingType({ organizationID: orgID, start, end })
  const { isFetching: isFetchingMonth, monthDataSet, monthRevenueDataSet } = useIndicatorsByMonth({ organizationID: orgID })

  const revenuePercent = isFetching ? 0 : (indicators?.net_income as number) / (indicators?.revenue as number) * 100

  const shipping_type = {
    'fulfillment': 'FULL',
    'xd_drop_off': 'Agencia',
    'self_service': 'Flex'
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
              <Text style={styles.greetingText}>Angelica</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity>
              <MaterialCommunityIcons name={'eye-off-outline'} color={'#8D8E8D'} size={30} />
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
            <TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontFamily: 'Robo-Light', color: '#222222' }}>7 dias</Text>
                <MaterialCommunityIcons name={'menu-down'} color={'#222222'} size={20} />
              </View>
            </TouchableOpacity>
          </View>
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
