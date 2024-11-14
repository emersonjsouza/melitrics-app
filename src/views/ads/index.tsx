import React, { useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Card from './card';
import NavigationButton from '../../components/navigation-button';
import { useAds } from '../../hooks/useAds';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../assets/color';
import { Dropdown } from 'react-native-element-dropdown';
import LottieView from 'lottie-react-native';

export default function ({ navigation }: any): React.JSX.Element {
  const { currentOrg } = useAuth()
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
    })
  }, [total])

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
              { label: 'Situação', value: '' },
              { label: 'Ativo', value: 'active' },
              { label: 'Pausado', value: 'paused' }
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
            style={dropStyle.containerStyle}
            itemTextStyle={dropStyle.itemStyle}
            data={[
              { label: 'Estoque', value: '' },
              { label: 'Sem estoque', value: 'out_of_stock' },
            ]}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={subStatus}
            onChange={({ value }: any) => {
              setSubStatus(value);
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
            data={[
              { label: 'Logistica', value: '' },
              { label: 'Full', value: 'fulfillment' },
              { label: 'Flex', value: 'self_service' },
              { label: 'Agencia', value: 'xd_drop_off' },
              { label: 'Correio', value: 'drop_off' },
            ]}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={logisticType}
            onChange={({ value }: any) => {
              setLogisticType(value);
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
          Você não tem nenhum produto registrada no momento
        </Text>
      </View>}

      {total > 0 && <FlatList style={styles.adsContainer}
        data={data?.flatMap(x => x.items)} keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (<Card visibility={true} navigate={navigation.navigate} item={item} />)}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage()
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<FooterListComponent isFetching={isFetching} />}
      />}
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
