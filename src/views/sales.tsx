import React, { useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
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
  const [offset, setOffset] = useState<number>(0)
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))


  const { data, total, isFetching } = useOrders({ organizationID: orgID, start: startDate, end: endDate, offset, enableFetching: true })

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: 'Vendas',
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <View style={{ alignItems: "center", justifyContent: "center", height: 50, width: 50 }}>
              <MaterialCommunityIcons name="check" color={'#FFF'} size={25} />
            </View>
          </TouchableOpacity>
        </View>
      )
    })
  }, [])

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent barStyle="light-content" backgroundColor={'#7994F5'} />
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', height: 100, marginTop: 10, justifyContent: 'space-around' }}>
          <TouchableOpacity>
            <View style={{ flexDirection: 'row', borderRadius: 5, padding: 10 }}>
              <Text style={{ fontFamily: 'Robo-Light', color: '#FFF' }}>Hoje</Text>
              <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={{ flexDirection: 'row', borderRadius: 5, padding: 10 }}>
              <Text style={{ fontFamily: 'Robo-Light', color: '#FFF' }}>Status da Venda</Text>
              <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={{ flexDirection: 'row', borderRadius: 5, padding: 10 }}>
              <Text style={{ fontFamily: 'Robo-Light', color: '#FFF' }}>Tipo de Frete</Text>
              <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList style={{ paddingTop: 10, paddingHorizontal: 5 }}
        data={data} keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (<CardSale item={item} />)}
        onEndReached={() => {
          if (!isFetching && total > offset) {
            setOffset(offset + 20)
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
    flexDirection: 'column',

    backgroundColor: '#7994F5',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 60
  },
  greetingContainer: {
    marginLeft: 5,
    alignContent: 'center'
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
