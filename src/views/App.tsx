import React, { useEffect, useState } from 'react';
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
  AppState,
  Linking,
  Alert,
} from 'react-native';
import { Colors } from '../assets/color';
import { useAuth } from '../context/AuthContext';
import { useFeatureFlag, usePostHog } from 'posthog-react-native'
import DeviceInfo from 'react-native-device-info';

function App(props: any): React.JSX.Element {
  const { login, loggedIn, loading, organizations, isFetchingOrganizations } = useAuth()
  const signupFlag = useFeatureFlag('new-signup')
  
  const posthog = usePostHog()

  const onSignIn = async () => {
    try {
      await login();
    } catch (e) {
      console.log(e);
    }
  }

  const deviceVersion = DeviceInfo.getVersion() + "." + DeviceInfo.getBuildNumber()
  const [deviceControlChecked, setDeviceControlChecked] = useState(false)
  const appVersionControl = useFeatureFlag('app-version-control')

  useEffect(() => {
    if (appVersionControl) {
      let deviceFlagPayload = posthog.getFeatureFlagPayload('app-version-control')
      if (deviceFlagPayload) {
        const deviceFlag = JSON.parse(JSON.stringify(deviceFlagPayload)) as { android: string, ios: string }

        const currentVersion = parseInt(deviceVersion.replace(/\./g, ""))
        const iosTargetVersion = parseInt(deviceFlag.ios.replace(/\./g, ""))
        const androidTargetVersion = parseInt(deviceFlag.ios.replace(/\./g, ""))

        if (Platform.OS == "ios" && currentVersion < iosTargetVersion) {
          Alert.alert("Atenção", "Melitrics tem uma nova versão obrigatória, atualize seu aplicativo")
          return
        } else if (currentVersion < androidTargetVersion) {
          Alert.alert("Atenção", "Melitrics tem uma nova versão obrigatória, atualize seu aplicativo")
          Linking.openURL("http://play.google.com/store/apps/details?id=com.melitricsapp")
          return
        }
      }

      setDeviceControlChecked(true)
    }
  }, [appVersionControl])

  useEffect(() => {
    if (deviceControlChecked) {
      if (loggedIn && organizations != undefined) {
        if (organizations.length == 0 || organizations.findIndex(x => x.has_channel) == -1) {
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: "connect",
              },
            ],
          });
        } else {
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: "Home",
              },
            ],
          });
        }
      }
    }
  }, [loggedIn, organizations, isFetchingOrganizations, deviceControlChecked])

  const appState = React.useRef(AppState.currentState);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      if (appState.current == 'active') {
        posthog.reloadFeatureFlags()
      }
    });

    return () => {
      subscription.remove();
    };
  }, [])

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
          {signupFlag && <TouchableOpacity onPressIn={() => props.navigation.navigate('Register')} style={styles.signUpButton}>
            <Text style={styles.signUpText}>cadastre-se grátis</Text>
          </TouchableOpacity>}
          {signupFlag != undefined && !signupFlag &&
            <View style={{ marginTop: 40 }}>
              <Text style={{ ...styles.signUpText, color: '#c2c2c2', flexWrap: 'wrap', width: Dimensions.get('screen').width * 0.8 }}>cadastro temporariamente desabilitado, em breve iremos liberar novos cadastros</Text>
            </View>
          }
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
