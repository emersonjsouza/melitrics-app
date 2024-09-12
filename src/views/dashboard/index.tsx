import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ContentLoader, { Rect } from 'react-content-loader/native'
import { useIndicators } from '../../hooks/useIndicators';
import { Dropdown } from 'react-native-element-dropdown';
import { useAuth } from '../../context/AuthContext';
import { format, subDays } from 'date-fns'
import Operations from './operations';
import Report from './report';
import Indicators from './indicators';
import { formatToBRL } from '../../utils';
import ProgressBar from '../../components/progressbar';
import { Colors } from '../../assets/color';

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

  useEffect(() => {
    if (route?.params?.firstTime) {
      Alert.alert("Atenção", "Estamos sincronizando suas informações dos últimos 30 dias")
    }
  }, [])

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
              <Text style={{ fontFamily: 'Robo-Light', color: Colors.TextColor }}>Seu Faturamento</Text>
              {!isFetching && <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 25, marginTop: 2, color: Colors.TextColor }}>{formatToBRL(indicators?.revenue)}</Text>}
              {isFetching && <ContentLoader
                height={20}
                speed={1}
                backgroundColor={'#999'}
                foregroundColor={'#ccc'}
                viewBox="0 0 380 60">
                <Rect x="0" y="40" rx="3" ry="10" width="380" height="500" />
              </ContentLoader>}
            </View>
            <View >
              <Dropdown
                style={{ width: 200, height: 40, paddingRight: 10 }}
                placeholderStyle={dropStyle.placeholderStyle}
                selectedTextStyle={dropStyle.selectedTextStyle}
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
                renderItem={(item) => {
                  return (<View style={{ height: 40, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={dropStyle.itemStyle}>{item.label}</Text>
                    {item.value != '0' && item.value != '1' && <View style={{ marginRight: 10 }}>
                      <MaterialCommunityIcons name={'chess-queen'} color={Colors.PremiumColor} size={15} />
                    </View>}
                  </View>)
                }}
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
                    else if (value != 'custom') {
                      setEndDate(format(new Date(), 'yyyy-MM-dd'))
                    }
                  }
                }}
              />
            </View>
          </View>
          <ProgressBar />
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


const dropStyle = StyleSheet.create({
  selectedTextStyle: { alignContent: 'flex-end', textAlign: 'right', color: Colors.TextColor, fontSize: 12 },
  placeholderStyle: { alignContent: 'flex-end', color: Colors.TextColor, fontSize: 12 },
  iconStyle: { alignItems: 'flex-start', width: 20, height: 20 },
  itemStyle: { fontSize: 11 }
})

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
    color: Colors.TextColor,
    fontFamily: 'Roboto-Thin',
  },
  greetingText: {
    color: Colors.TextColor,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});
