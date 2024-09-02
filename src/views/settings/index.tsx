import React, { useLayoutEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import NavigationButton from '../../components/navigation-button';
import { useAuth } from '../../context/AuthContext';

export default function (props: any): React.JSX.Element {
  const { logout } = useAuth()

  const signOut = () => {
    logout(() => {
      props.navigation.navigate('App')
    })
  }

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: `Configurações`,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <NavigationButton onPress={signOut} icon='logout' />
        </View>
      )
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
