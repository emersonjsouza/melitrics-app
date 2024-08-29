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

export default function (props: any): React.JSX.Element {
  const { currentOrg } = useAuth()

  const { data, total, isFetching, fetchNextPage, hasNextPage } = useAds({
    organizationID: currentOrg
  })

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: `(${total}) Anúncios`,
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
      <FlatList style={styles.adsContainer}
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
  adsContainer: {
    paddingTop: 10
  }
});
