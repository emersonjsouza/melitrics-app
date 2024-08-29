import React, { useLayoutEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import NavigationButton from '../../components/navigation-button';

export default function (props: any): React.JSX.Element {
  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: `Anúncios`
    })
  }, [])

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent barStyle="light-content" backgroundColor={'#7994F5'} />

    </View>
  )
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  }
});
