import React, { useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { format } from 'date-fns'
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import Card from './card';
import FilterButton from './filter-button'
import NavigationButton from '../../components/navigation-button';

export default function (props: any): React.JSX.Element {
  const { currentOrg } = useAuth()
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))

  const { data, total, isFetching, fetchNextPage, hasNextPage } = useOrders({
    organizationID: currentOrg,
    start: startDate,
    end: endDate
  })

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: `(${total}) Vendas`,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <NavigationButton icon='check' />
        </View>
      )
    })
  }, [total])

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent barStyle="light-content" backgroundColor={'#7994F5'} />
      <View style={styles.headerContainer}>
        <FilterButton label='Hoje' icon='menu-down' />
        <FilterButton label='Status da Venda' icon='menu-down' />
        <FilterButton label='Tipo de Frete' icon='menu-down' />
      </View>
      <FlatList style={styles.ordersContainer}
        data={data?.flatMap(x => x.items)} keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (<Card item={item} />)}
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
    backgroundColor: '#7994F5',
    paddingTop: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 60
  },
  ordersContainer: {
    paddingTop: 10,
    paddingHorizontal: 5
  }
});
