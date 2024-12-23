import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  AppState,
  Appearance,
  RefreshControl
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ContentLoader, { Rect } from 'react-content-loader/native'
import { useIndicators } from '../../hooks/useIndicators';
import { useGoal } from '../../hooks/useGoal';
import { Dropdown } from 'react-native-element-dropdown';
import { useAuth } from '../../context/AuthContext';
import { differenceInMinutes, format, subDays, toDate } from 'date-fns'
import Operations from './operations';
import Report from './report';
import Indicators from './indicators';
import { CUSTOM_LOCALE, formatToBRL } from '../../utils';
import ProgressBar from '../../components/progressbar';
import { Colors } from '../../assets/color';
import { Modal } from '../../components/modal';
import Calendar from "react-native-calendar-range-picker";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from "@tanstack/react-query";
import { usePostHog } from 'posthog-react-native';

export default function ({ navigation, route }: any): React.JSX.Element {
  const { userData, currentOrg } = useAuth()
  const [dateSelect, setDateSelect] = useState('0')
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const operationRef = useRef<{ refresh: () => Promise<void> }>()
  const reportRef = useRef<{ refresh: () => Promise<void> }>()
  const barProgresRef = useRef<{ setOnProgress: (value: number) => Promise<void> }>()
  const {
    isFetching,
    isRefetching,
    refetch: refreshIndicators,
    data: indicators
  } = useIndicators({ organizationID: currentOrg?.organization_id || '', start: startDate, end: endDate })
  const [barProgressLabel, setBarProgressLabel] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { data: goal } = useGoal({ organizationID: currentOrg?.organization_id || '' })
  const appState = React.useRef(AppState.currentState);
  const queryClient = useQueryClient();
  const posthog = usePostHog()
  const newSubscriptionEnabled = posthog.getFeatureFlag('new-premium-subscription')

  useEffect(() => {
    if (goal) {
      let label = ''
      let currentGoal = 0
      if (dateSelect == "0" || dateSelect == "1") {
        currentGoal = goal.day
        label = 'Diária'
      } else if (dateSelect == "6") {
        currentGoal = goal.week
        label = 'Semanal'
      } else if (dateSelect == "14") {
        currentGoal = goal.biweekly
        label = 'Quinzenal'
      }
      else {
        currentGoal = goal.month
        label = 'Mensal'
      }

      const netIncome = indicators?.net_income as number
      if (netIncome > 0 && currentGoal > 0) {
        if ((currentGoal - netIncome) > 0) {
          setBarProgressLabel(`Ainda falta ${formatToBRL(currentGoal - netIncome)}, sua meta de margem ${label} é ${formatToBRL(currentGoal)}`)
        }
        else {
          setBarProgressLabel(`Parabéns você já completou sua meta ${label} de ${formatToBRL(currentGoal)}`)
        }

        const width = Dimensions.get('screen').width - 20
        const widthProgress = (width / 100) * (netIncome / currentGoal * 100)
        barProgresRef.current?.setOnProgress((width - widthProgress) > 0 ? widthProgress : (width))
      }
    }
  }, [goal, indicators?.net_income])


  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      appState.current = nextAppState;
      if (appState.current == 'active') {

        if (dateSelect == '0' && startDate != format(new Date(), 'yyyy-MM-dd')) {
          await queryClient.invalidateQueries({
            queryKey: ['indicators-shipping-type', 'indicators', 'indicators-month', 'goal']
          })
        }
        else {
          onRefresh()
        }

        posthog.reloadFeatureFlags()

        await queryClient.invalidateQueries({
          queryKey: ['user']
        })
      }
    });

    return () => {
      subscription.remove();
    };
  }, [])

  const onRefresh = async () => {
    await Promise.all([
      operationRef.current?.refresh(),
      reportRef.current?.refresh(),
      refreshIndicators()
    ])
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      posthog.reloadFeatureFlags()
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.firstTime) {
      Alert.alert("Atenção", "Estamos sincronizando suas informações dos últimos 30 dias")
    }
  }, [])

  useEffect(() => {
    let newSubscriptionEnabled = posthog.getFeatureFlag('new-premium-subscription')
    if (newSubscriptionEnabled && Platform.OS == "ios") {
      Appearance.setColorScheme('dark');
      if (currentOrg && differenceInMinutes(toDate(currentOrg.subscription_expires_at), new Date()) <= 0) {
        navigation.navigate('subscription');
      }
    }
  }, [currentOrg, newSubscriptionEnabled])

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.mainContainer}>
      <StatusBar translucent barStyle="dark-content" backgroundColor={'#FFF'} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={true}
      >
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
        <View style={{ marginTop: 10, marginLeft: 0 }}>
          <View style={styles.profitContainer}>
            <View style={{ paddingLeft: Platform.OS == 'android' ? 15 : 0 }}>
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
                  { label: 'Últimos 30 dias', value: '29' },
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
          </View>
          <ProgressBar ref={barProgresRef} label={barProgressLabel} />
        </View>

        <Indicators isFetching={isFetching} data={indicators} />



        <Operations ref={operationRef} organizationID={currentOrg?.organization_id || ''} startDate={startDate} endDate={endDate} />

        <Report ref={reportRef} organizationID={currentOrg?.organization_id || ''} />
      </ScrollView >
    </SafeAreaView>
  )
}


const dropStyle = StyleSheet.create({
  selectedTextStyle: { alignContent: 'flex-end', textAlign: 'right', color: Colors.TextColor, fontSize: 12 },
  placeholderStyle: { alignContent: 'flex-end', color: Colors.TextColor, fontSize: 12 },
  iconStyle: { alignItems: 'flex-start', width: 20, height: 20 },
  itemStyle: { fontSize: 12, color: Colors.TextColor, }
})

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS == 'android' ? 40 : 50,
    backgroundColor: '#fff'
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
