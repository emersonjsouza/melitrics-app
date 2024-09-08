import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ContentLoader, { Rect } from 'react-content-loader/native'
import { useIndicators } from '../../hooks/useIndicators';

import { useAuth } from '../../context/AuthContext';
import { format, subDays } from 'date-fns'
import Operations from './operations';
import Report from './report';
import Indicators from './indicators';
import RNPickerSelect from "react-native-picker-select";
import { formatToBRL } from '../../utils';

export default function ({ navigation, route }: any): React.JSX.Element {
  const { userData, currentOrg } = useAuth()
  const [dateSelect, setDateSelect] = useState('0')
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))

  const operationRef = useRef<{ refresh: () => Promise<void> }>()
  const reportRef = useRef<{ refresh: () => Promise<void> }>()

  const {
    isFetching,
    refetch: refreshIndicators,
    data: indicators
  } = useIndicators({ organizationID: currentOrg?.organization_id || '', start: startDate, end: endDate })

  const onRefresh = async () => {
    await Promise.all([operationRef.current?.refresh(), reportRef.current?.refresh(), refreshIndicators()])
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh()
    });

    return unsubscribe;
  }, [navigation]);

  const performFilter = () => {
    navigation.navigate('Dashboard-Filter')
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
              <Text style={styles.profileText}>{currentOrg?.name.substring(0, 2).toUpperCase()}</Text>
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingSubText}>Seja bem vindo,</Text>
              {userData && <Text style={styles.greetingText}>{userData.name}</Text>}
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={onRefresh}>
              <MaterialCommunityIcons name={'refresh'} color={'#8D8E8D'} size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: 10, marginLeft: 20 }}>
          <View style={styles.profitContainer}>
            <View>
              <Text style={{ fontFamily: 'Robo-Light' }}>Seu Faturamento</Text>
              {!isFetching && <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 25, marginTop: 2 }}>{formatToBRL(indicators?.revenue)}</Text>}
              {isFetching && <ContentLoader
                height={20}
                speed={1}
                backgroundColor={'#999'}
                foregroundColor={'#ccc'}
                viewBox="0 0 380 60">
                <Rect x="0" y="40" rx="3" ry="10" width="380" height="500" />
              </ContentLoader>}
            </View>
            <View style={{ flexDirection: 'row' }}>
              <RNPickerSelect
                key={dateSelect}
                value={dateSelect}
                placeholder={{ label: 'selecione um período', value: '' }}
                doneText='Filtrar'
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
              <MaterialCommunityIcons name={'menu-down'} color={'#222222'} size={20} />
            </View>
          </View>
        </View>

        <Indicators isFetching={isFetching} data={indicators} />

        <Text style={{
          fontFamily: 'Roboto-Medium',
          marginTop: 20,
          color: '#212946',
          fontSize: 18,
          marginLeft: 20,
        }}>Minhas Operações</Text>

        <Operations ref={operationRef} organizationID={currentOrg?.organization_id || ''} startDate={startDate} endDate={endDate} />

        <Report ref={reportRef} organizationID={currentOrg?.organization_id || ''} />
      </ScrollView >
    </View >
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: Platform.OS == 'android' ? 40 : 20,
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
