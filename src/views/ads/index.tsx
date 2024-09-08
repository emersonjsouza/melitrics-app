import React, { useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Card from './card';
import NavigationButton from '../../components/navigation-button';
import { useAds } from '../../hooks/useAds';
import RNPickerSelect from "react-native-picker-select";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../assets/color';

export default function ({ navigation }: any): React.JSX.Element {
  const { currentOrg, adInfoVisibility, saveAdInfoVisibility } = useAuth()
  const [status, setStatus] = useState('')
  const [subStatus, setSubStatus] = useState('')
  const [logisticType, setLogisticType] = useState('')

  const { data, total, isFetching, fetchNextPage, hasNextPage, refetch } = useAds({
    organizationID: currentOrg?.organization_id || '',
    status,
    subStatus,
    logisticType
  })

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch()
    });

    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `(${total}) Anúncios`,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <NavigationButton onPress={saveAdInfoVisibility} icon={adInfoVisibility ? 'eye-off-outline' : 'eye-outline'} />
        </View>
      )
    })
  }, [total, adInfoVisibility])

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent barStyle="light-content" backgroundColor={Colors.Main} />
      <View style={styles.headerContainer}>
        <View style={styles.filterButton}>
          <RNPickerSelect
            placeholder={{ label: 'Situação', value: '' }}
            doneText='Filtrar'
            style={{ placeholder: { color: '#FFF' }, inputAndroid: { color: '#FFF' }, inputIOS: { color: '#FFF' } }}
            key={status}
            value={status}
            onValueChange={value => setStatus(value)}
            items={[
              { label: 'Todos', value: '' },
              { label: 'Ativo', value: 'active' },
              { label: 'Pausado', value: 'paused' }
            ]}
          />
          <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
        </View>
        <View style={styles.filterButton}>
          <RNPickerSelect
            placeholder={{ label: 'Estoque', value: '' }}
            doneText='Filtrar'
            style={{ placeholder: { color: '#FFF' }, inputAndroid: { color: '#FFF' }, inputIOS: { color: '#FFF' } }}
            key={subStatus}
            value={subStatus}
            onValueChange={value => setSubStatus(value)}
            items={[
              { label: 'Todos', value: '' },
              { label: 'Sem estoque', value: 'out_of_stock' },
            ]}
          />
          <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
        </View>

        <View style={styles.filterButton}>
          <RNPickerSelect
            placeholder={{ label: 'Logistica', value: '' }}
            doneText='Filtrar'
            key={logisticType}
            value={logisticType}
            onValueChange={value => setLogisticType(value)}
            style={{ placeholder: { color: '#FFF' }, inputAndroid: { color: '#FFF' }, inputIOS: { color: '#FFF' } }}
            items={[
              { label: 'Todos', value: '' },
              { label: 'FULL', value: 'fulfillment' },
              { label: 'Flex', value: 'self_service' },
              { label: 'Agencia/Correios', value: 'xd_drop_off' },
            ]}
          />
          <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
        </View>
      </View>
      <FlatList style={styles.adsContainer}
        data={data?.flatMap(x => x.items)} keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (<Card visibility={adInfoVisibility} navigate={navigation.navigate} item={item} />)}
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
  adsContainer: {
    paddingTop: 10
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
