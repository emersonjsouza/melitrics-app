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

export default function (props: any): React.JSX.Element {
  const { currentOrg, adInfoVisibility, saveAdInfoVisibility } = useAuth()

  const { data, total, isFetching, fetchNextPage, hasNextPage, refetch } = useAds({
    organizationID: currentOrg?.organization_id || '',
  })

  useLayoutEffect(() => {
    props.navigation.setOptions({
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
            onValueChange={(value) => { }}
            items={[
              { label: 'Todos', value: '' },
              { label: 'Ativo', value: '1' },
              { label: 'Inativo', value: '2' },
            ]}
          />
          <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
        </View>
        <View style={styles.filterButton}>
          <RNPickerSelect
            placeholder={{ label: 'Estoque', value: '' }}
            doneText='Filtrar'
            style={{ placeholder: { color: '#FFF' }, inputAndroid: { color: '#FFF' }, inputIOS: { color: '#FFF' } }}
            onValueChange={(value) => { }}
            items={[
              { label: 'Com estoque', value: '' },
              { label: 'Sem estoque', value: '1' },
              { label: 'Estoque no FULL', value: '2' },
              { label: 'Com estoque mínimo', value: '3' },
              { label: 'Com estoque alto', value: '4' },
            ]}
          />
          <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
        </View>

        <View style={styles.filterButton}>
          <RNPickerSelect
            placeholder={{ label: 'Margem', value: '' }}
            doneText='Filtrar'
            style={{ placeholder: { color: '#FFF' }, inputAndroid: { color: '#FFF' }, inputIOS: { color: '#FFF' } }}
            onValueChange={(value) => { }}
            items={[
              { label: 'Negativa', value: '0' },
              { label: 'Até 5%', value: '1' },
              { label: 'de 5% à 10%', value: '2' },
              { label: 'Acima de 10%', value: '3' },
            ]}
          />
          <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
        </View>
      </View>
      <FlatList style={styles.adsContainer}
        data={data?.flatMap(x => x.items)} keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (<Card visibility={adInfoVisibility} navigate={props.navigation.navigate} item={item} />)}
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
