import React, { useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardSale from '../components/card-sale';
import { useOrders } from '../hooks/useOrders';
import { format } from 'date-fns'

export default function (props: any): React.JSX.Element {
  const orgID = 'cb2a3984-1d36-4435-94b0-32c5cbc2b8fc'

  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))

  const { data, total, isFetching, fetchNextPage, hasNextPage } = useOrders({
    organizationID: orgID,
    start: startDate,
    end: endDate
  })

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: `(${total}) Vendas`,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <View style={styles.navigationButton}>
              <MaterialCommunityIcons name="check" color={'#FFF'} size={25} />
            </View>
          </TouchableOpacity>
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
        renderItem={({ item }) => (<CardSale item={item} />)}
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

const FilterButton = (props: { icon: string, label: string }) => (<TouchableOpacity>
  <View style={styles.filterButton}>
    <Text style={styles.filterButtonText}>{props.label}</Text>
    <MaterialCommunityIcons name={props.icon} color={'#FFF'} size={20} />
  </View>
</TouchableOpacity>)

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
  filterButton: {
    flexDirection: 'row',
    borderRadius: 5,
    padding: 10
  },
  filterButtonText: {
    fontFamily: 'Robo-Light',
    color: '#FFF'
  },
  ordersContainer: {
    paddingTop: 10,
    paddingHorizontal: 5
  },
  navigationButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50
  }
});
