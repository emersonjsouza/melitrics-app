import React, { useEffect, useLayoutEffect } from 'react';
import {
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import NavigationButton from '../../components/navigation-button';
import { useAuth } from '../../context/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';
import { Colors } from '../../assets/color';
import { usePostHog } from 'posthog-react-native';

export default function ({ navigation }: any): React.JSX.Element {
  const { logout } = useAuth()
  const posthog = usePostHog()
  const newSubscriptionEnabled = posthog.getFeatureFlag('new-premium-subscription')
  const syncStockEnabled = posthog.getFeatureFlag('settings-sync-stock')
  const syncSalesEnabled = posthog.getFeatureFlag('settings-sync-sales')
  const shareAccountEnabled = posthog.getFeatureFlag('settings-share-account')
  const supportContactEnabled = posthog.getFeatureFlag('support-contact')

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
        <View style={{ flexDirection: 'row' }}>
          <NavigationButton onPress={signOut} icon='logout' />
        </View>
      )
    })
  }, [])

  const onSupport = () => {
    const supportContactPayload = posthog.getFeatureFlagPayload('support-contact') as any
    Linking.openURL(`whatsapp://send?phone=${supportContactPayload.whatsapp}`)
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent barStyle="light-content" backgroundColor={Colors.Main} />

      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Image source={require('../../assets/images/logomarca.png')} style={{ width: 350, height: 250, resizeMode: 'contain' }} />
        <Text style={{ marginTop: 20, color: Colors.TextColor }}>versão: {deviceVersion}</Text>
      </View>


      {newSubscriptionEnabled && <TouchableOpacity onPress={() => navigation.navigate('subscription')} >
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
