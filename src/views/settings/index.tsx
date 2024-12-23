import React, { useLayoutEffect } from 'react';
import {
  Image,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DeviceInfo from 'react-native-device-info';
import { Colors } from '../../assets/color';
import { usePostHog } from 'posthog-react-native';
import { useDeleteUserMutation } from '../../hooks/useDeleteUserMutation';
import { Alert } from 'react-native';

export default function ({ navigation }: any): React.JSX.Element {
  const { logout, userData } = useAuth()
  const posthog = usePostHog()
  const newSubscriptionEnabled = posthog.getFeatureFlag('new-premium-subscription')
  const syncStockEnabled = posthog.getFeatureFlag('settings-sync-stock')
  const syncSalesEnabled = posthog.getFeatureFlag('settings-sync-sales')
  const shareAccountEnabled = posthog.getFeatureFlag('settings-share-account')
  const supportContactEnabled = posthog.getFeatureFlag('support-contact')
  const deactivationAccountEnabled = posthog.getFeatureFlag('deactivation-account')

  const { mutateAsync } = useDeleteUserMutation()

  const deviceVersion = DeviceInfo.getVersion() + "." + DeviceInfo.getBuildNumber()
  const signOut = () => {
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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Configurações`,
      headerRight: () => (
        <TouchableOpacity onPress={signOut}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 16, textAlign: 'right' }}>Sair</Text>
          </View>
        </TouchableOpacity>
      )
    })
  }, [])

  const onSupport = () => {
    const supportContactPayload = posthog.getFeatureFlagPayload('support-contact') as any
    Linking.openURL(`whatsapp://send?phone=${supportContactPayload.whatsapp}`)
  }

  const deleteUser = async () => {
    Alert.alert("Atenção", "Você tem certeza que deseja realmente excluir sua conta?", [{
      "text": "cancelar",
    }, {
      text: "Continuar",
      onPress: async () => {
        await mutateAsync(userData.sub)
        signOut()
      }
    }])
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent barStyle="light-content" backgroundColor={Colors.Main} />

      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Image source={require('../../assets/images/logomarca.png')} style={{ width: 350, height: 250, resizeMode: 'contain' }} />
        <Text style={{ marginTop: 20, color: Colors.TextColor }}>versão: {deviceVersion}</Text>
      </View>


      {(newSubscriptionEnabled && Platform.OS == "ios") && <TouchableOpacity onPress={() => navigation.navigate('subscription')} >
        <View style={{ flexDirection: 'row', marginBottom: 20, height: 40, borderColor: '#ddd', borderWidth: 0.5, justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 15 }}>
          <MaterialCommunityIcons name={'chess-queen'} color={Colors.PremiumColor} size={25} />
          <Text style={{ color: Colors.TextColor, marginLeft: 10 }}>Seja premium</Text>
        </View>
      </TouchableOpacity>}

      <TouchableOpacity onPress={() => navigation.navigate('Goal')} disabled={false}>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'flag-checkered'} color={Colors.TextColor} size={25} />
            <Text style={{ color: Colors.TextColor, marginLeft: 10 }}>Definir meta de margem</Text>
          </View>
        </View>
      </TouchableOpacity>

      {supportContactEnabled && <TouchableOpacity onPress={() => onSupport()}>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'face-agent'} color={Colors.TextColor} size={25} />
            <Text style={{ color: Colors.TextColor, marginLeft: 10 }}>Suporte Técnico</Text>
          </View>
        </View>
      </TouchableOpacity>}

      {syncStockEnabled && <TouchableOpacity activeOpacity={1} disabled={false}>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'sync'} color={Colors.TextColor} size={25} />
            <Text style={{ color: Colors.TextColor, marginLeft: 10 }}>Sincronizar estoque</Text>
          </View>
          <View style={{ backgroundColor: Colors.PremiumColor, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginRight: 10 }}>
            <Text style={{ fontSize: 9, color: '#fff' }}>em breve</Text>
          </View>
        </View>
      </TouchableOpacity>}

      {syncSalesEnabled && <TouchableOpacity activeOpacity={1} disabled={false}>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'sync'} color={Colors.TextColor} size={25} />
            <Text style={{ color: Colors.TextColor, marginLeft: 10 }}>Sincronizar vendas</Text>
          </View>
          <View style={{ backgroundColor: Colors.PremiumColor, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginRight: 10 }}>
            <Text style={{ fontSize: 9, color: '#fff' }}>em breve</Text>
          </View>
        </View>
      </TouchableOpacity>}

      {shareAccountEnabled && <TouchableOpacity activeOpacity={1} disabled={false}>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'share-all'} color={Colors.TextColor} size={25} />
            <Text style={{ color: Colors.TextColor, marginLeft: 10 }}>Compartilhar minha conta</Text>
          </View>
          <View style={{ backgroundColor: Colors.PremiumColor, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginRight: 10 }}>
            <Text style={{ fontSize: 9, color: '#fff' }}>em breve</Text>
          </View>
        </View>
      </TouchableOpacity>}

      {deactivationAccountEnabled && <TouchableOpacity activeOpacity={1} onPress={deleteUser}>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'store-remove'} color={Colors.TextColor} size={25} />
            <Text style={{ color: Colors.TextColor, marginLeft: 10 }}>Excluir minha conta</Text>
          </View>
        </View>
      </TouchableOpacity>}

      <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: Platform.OS == 'ios' ? 'space-between' : 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={() => Linking.openURL('https://melitrics.com/privacity')}>
          <Text style={{ color: Colors.TextColor, fontSize: 10 }}>Política de Privacidade</Text>
        </TouchableOpacity>

        {Platform.OS == 'ios' && <TouchableOpacity onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
          <Text style={{ color: Colors.TextColor, fontSize: 10 }}>Termos de Uso (EULA)</Text>
        </TouchableOpacity>}
      </View>
    </View >
  )
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  logoText: {
    marginTop: 80,
    fontSize: 30,
    color: Colors.TextColor,
    fontWeight: 'bold',
  },
});
