import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { Colors } from '../assets/color';
import { useAuth } from '../context/AuthContext';

function App(props: any): React.JSX.Element {
  const { login, loggedIn, loading, organizations, isFetchingOrganizations } = useAuth()

  const onSignIn = async () => {
    try {
      await login();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (loggedIn && organizations != undefined) {
      if (organizations.length == 0 || organizations.findIndex(x => x.has_channel) == -1) {
        props.navigation.navigate('connect', {
          merge: true,
        })
      } else {
        props.navigation.navigate('Home', {
          merge: true,
        })
      }
    }
  }, [loggedIn, organizations, isFetchingOrganizations])

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle={'dark-content'} />
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.logoText}>MELITRICS</Text>
        <Text style={{ color: Colors.Main }}>Gestão Inteligente de qualquer lugar</Text>
      </View>
      <View style={{ justifyContent: 'center', height: Dimensions.get('screen').height * 0.5 }}>
        <Image source={require('../assets/images/banner.png')} style={{ width: 200, resizeMode: 'contain' }} />
      </View>
      <View>
        {loading || isFetchingOrganizations && <ActivityIndicator size="large" color={Colors.Main} />}
        {!loading && !loggedIn && <><TouchableOpacity style={styles.signButton} onPress={onSignIn}>
          <Text style={styles.submitText}>acessar minha conta</Text>
        </TouchableOpacity>
          <TouchableOpacity onPressIn={() => props.navigation.navigate('Register')} style={styles.signUpButton}>
            <Text style={styles.signUpText}>cadastre-se grátis</Text>
          </TouchableOpacity>
        </>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) * 1.5 : 0,
  },
  logoText: {
    marginTop: 80,
    fontSize: 30,
    color: Colors.Main,
    fontWeight: 'bold',
  },
  signButton: {
    width: Dimensions.get('screen').width * .8,
    height: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.Main,
    borderColor: Colors.Main,
    borderRadius: 10,
    borderWidth: 1,
  },
  signUpButton: {
    width: Dimensions.get('screen').width * .8,
    height: 50,
    marginTop: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 10,

  },
  signUpText: {
    color: Colors.Main,
    textAlign: 'center',
  },
  submitText: {
    color: '#FFF',
    textAlign: 'center',
  }
});

export default App;
