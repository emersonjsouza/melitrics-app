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
  const { login, loggedIn, loading, organizations, isFetchingOrganizations, deviceVersion, onDeprecatedNotification, onVerifyAppVersion } = useAuth()
  const signupFlag = useFeatureFlag('new-signup')
  const posthog = usePostHog()

  const onSignIn = async () => {
    try {
      await login();
    } catch (e) {
      if (String(e).indexOf("blocked")) {
        Alert.alert("Atenção",
          `Conta desativada, caso deseja reativar entre em contato com nosso suporte: 
          suporte@devsouza.com`)
      }
    }
  }

  useEffect(() => {
    if (deviceVersion && !deviceVersion.isDeprecated) {
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
  }, [loggedIn, organizations, isFetchingOrganizations, deviceVersion])

  useEffect(() => {
    if (deviceVersion && deviceVersion.isDeprecated) {
      onDeprecatedNotification(deviceVersion.storeUrl)
      return
    }

  }, [deviceVersion?.isDeprecated])

  const appState = React.useRef(AppState.currentState);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      appState.current = nextAppState;
      if (appState.current == 'active') {
        await posthog.reloadFeatureFlagsAsync()
        onVerifyAppVersion()
      }
    });

    return () => {
      subscription.remove();
    };
  }, [])

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle={'dark-content'} />
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Image source={require('../assets/images/logomarca-azul.png')} style={{ width: 300, height: 300, resizeMode: 'contain' }} />
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
    backgroundColor: Colors.Main,
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
    backgroundColor: '#FFF',
    borderColor: '#FFF',
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
    color: '#FFF',
    textAlign: 'center',
  },
  submitText: {
    color: Colors.Main,
    textAlign: 'center',
  }
});

export default App;
