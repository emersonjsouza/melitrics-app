import React, { useEffect, useRef, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../assets/color';
import { useAuth } from '../context/AuthContext';
import settings from '../settings';
import { useMeliToken } from '../hooks/useMeliToken';
import { useChannel } from '../hooks/useChannel';
import { usePostHog } from 'posthog-react-native';
import LottieView from "lottie-react-native";

function App({ navigation, route }: any): React.JSX.Element {
  const { logout, currentOrg } = useAuth()
  const { mutateAsync: getTokenMutate, isPending: isTookenPending } = useMeliToken()
  const { mutateAsync: channelMutate, isPending: isChannelPending } = useChannel()
  const posthog = usePostHog()
  const callbackURL = Platform.OS == 'ios' ? settings.MELI_CONNECT_IOS : settings.MELI_CONNECT_ANDROID
  const onConnect = () => {
    Linking.openURL(settings.MELI_CONNECT + callbackURL)
  }

  const onSignOut = () => {
    logout(() => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "App",
          },
        ],
      });
    })
  }

  useEffect(() => {
    (async () => {
      let code: string = route?.params?.code;
      if (code) {
        if (Platform.OS == "android" && code.startsWith('1')) {
          code = code.substring(1)
        }

        const resp = await getTokenMutate({ code: code, callbackUrl: callbackURL })

        if (resp.access_token) {
          posthog.reloadFeatureFlags()

          await channelMutate({
            access_token: resp.access_token,
            refresh_token: resp.refresh_token,
            organization_id: currentOrg?.organization_id || '',
            external_id: resp.user_id.toString(),
            marketplace_code: 'mlb',
          })

          setEnableContinue(true)
        }
      }
    })()
  }, [route?.params?.code])

  const [enableContinue, setEnableContinue] = useState(false)

  return (
    <KeyboardAvoidingView style={styles.safeAreaContainer}>
      <StatusBar barStyle={'dark-content'} />
      {!route?.params?.code && <>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.logoText}>MELITRICS</Text>
        </View>
        <View style={{ marginTop: Dimensions.get('screen').height * 0.2, flex: 1, justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: '#718093', marginVertical: 10, flexWrap: 'wrap', fontWeight: 600, width: Dimensions.get('window').width * .8, textAlign: 'left' }}>FALTA SÓ UM PASSO 😋</Text>
            <Text style={{ color: '#718093', flexWrap: 'wrap', width: Dimensions.get('window').width * .8, textAlign: 'left' }}>Você ainda não possui nenhuma conta do Mercado Livre conectado</Text>

            <TouchableOpacity style={styles.signButton} onPress={onConnect}>
              {!isTookenPending && !isChannelPending && <Text style={styles.submitText}>Conectar ao Mercado Livre</Text>}
              {isTookenPending || isChannelPending && <ActivityIndicator size="large" color={'#FFF'} />}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPressIn={onSignOut} style={styles.signUpButton}>
            <Text style={styles.signUpText}>desconectar minha conta</Text>
          </TouchableOpacity>
        </View>
      </>}

      {enableContinue && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
        <View style={{ width: 200, height: 200 }}>
          <LottieView
            source={require("../assets/images/loading-data.json")}
            style={{ width: "100%", height: "100%" }}
            autoPlay
            loop
          />
        </View>
        <Text style={{ flexWrap: 'nowrap', textAlign: 'center', color: '#718093' }}>
          Falta pouco! Estamos baixando o seus dados de produto e venda em breve você já deve visualizar todas suas vendas e produtos
        </Text>
        <TouchableOpacity onPress={() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "Home",
              },
            ],
            params: {
              firstTime: true
            }
          });
        }}>
          <View style={{ borderRadius: 10, backgroundColor: Colors.Main, width: 200, height: 40, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: '#fff' }}>Continua</Text>
          </View>
        </TouchableOpacity>
      </View>}
    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) * 1.5 : 0,
  },
  formContainer: {
    marginTop: 30,
    marginHorizontal: 15,
  },
  input: {
    borderRadius: 10,
    borderColor: '#f2f2f2',
    borderWidth: 1.2,
    paddingLeft: 10,
    marginBottom: 10,
    width: Dimensions.get('window').width * .8,
    height: 45
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
    marginTop: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#f8d347',
    borderColor: '#f8d347',
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
