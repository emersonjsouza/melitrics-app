import React, { useLayoutEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacityBase
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

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.logoText}>MELITRICS</Text>
          <Text style={{ color: '#718093' }}>Gestão Inteligente de qualquer lugar</Text>
        </View>
        <Text style={{ marginTop: 20, color: '#718093' }}>versão: {deviceVersion}</Text>
      </View>

      <TouchableOpacity>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 15 }}>
          <MaterialCommunityIcons name={'chess-queen'} color={'#718093'} size={25} />
          <Text style={{ color: '#718093', marginLeft: 10 }}>Seja premium</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={1} disabled={false}>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'sync'} color={'#718093'} size={25} />
            <Text style={{ color: '#718093', marginLeft: 10 }}>Sincronizar estoque</Text>
          </View>
          <View style={{ backgroundColor: '#fb8c00', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginRight: 10 }}>
            <Text style={{ fontSize: 9, color: '#fff' }}>em breve</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={1} disabled={false}>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'sync'} color={'#718093'} size={25} />
            <Text style={{ color: '#718093', marginLeft: 10 }}>Sincronizar vendas</Text>
          </View>
          <View style={{ backgroundColor: '#fb8c00', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginRight: 10 }}>
            <Text style={{ fontSize: 9, color: '#fff' }}>em breve</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={1} disabled={false}>
        <View style={{ flexDirection: 'row', height: 40, borderTopColor: '#ddd', borderTopWidth: 0.5, justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name={'share-all'} color={'#718093'} size={25} />
            <Text style={{ color: '#718093', marginLeft: 10 }}>Compartilhar minha conta</Text>
          </View>
          <View style={{ backgroundColor: '#fb8c00', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, marginRight: 10 }}>
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
    color: '#718093',
    fontWeight: 'bold',
  },
});
