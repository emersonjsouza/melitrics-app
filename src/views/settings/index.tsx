import React, { useLayoutEffect } from 'react';
import {
  Image,
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

export default function ({ navigation }: any): React.JSX.Element {
  const { logout } = useAuth()

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

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent barStyle="light-content" backgroundColor={Colors.Main} />

      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Image source={require('../../assets/images/logomarca.png')} style={{ width: 250, height: 250, resizeMode: 'contain' }} />
        <Text style={{ marginTop: 20, color: Colors.TextColor }}>versão: {deviceVersion}</Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Subscription')} >
        <View style={{ flexDirection: 'row', marginBottom: 20, height: 40, borderColor: '#ddd', borderWidth: 0.5, justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 15 }}>
          <MaterialCommunityIcons name={'chess-queen'} color={Colors.PremiumColor} size={25} />
          <Text style={{ color: Colors.TextColor, marginLeft: 10 }}>Seja premium</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Goal')} disabled={false}>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'flag-checkered'} color={Colors.TextColor} size={25} />
            <Text style={{ color: Colors.TextColor, marginLeft: 10 }}>Definir meta de margem</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={1} disabled={false}>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'sync'} color={Colors.TextColor} size={25} />
            <Text style={{ color: Colors.TextColor, marginLeft: 10 }}>Sincronizar estoque</Text>
          </View>
          <View style={{ backgroundColor: Colors.PremiumColor, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginRight: 10 }}>
            <Text style={{ fontSize: 9, color: '#fff' }}>em breve</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={1} disabled={false}>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'sync'} color={Colors.TextColor} size={25} />
            <Text style={{ color: Colors.TextColor, marginLeft: 10 }}>Sincronizar vendas</Text>
          </View>
          <View style={{ backgroundColor: Colors.PremiumColor, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginRight: 10 }}>
            <Text style={{ fontSize: 9, color: '#fff' }}>em breve</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={1} disabled={false}>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'share-all'} color={Colors.TextColor} size={25} />
            <Text style={{ color: Colors.TextColor, marginLeft: 10 }}>Compartilhar minha conta</Text>
          </View>
          <View style={{ backgroundColor: Colors.PremiumColor, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginRight: 10 }}>
            <Text style={{ fontSize: 9, color: '#fff' }}>em breve</Text>
          </View>
        </View>
      </TouchableOpacity>
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
