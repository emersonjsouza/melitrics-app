import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardSale from '../components/card-sale';

export default function (): React.JSX.Element {
  return (
    <View style={styles.mainContainer}>
        <StatusBar translucent barStyle="light-content" backgroundColor={'#7994F5'} />
        <View style={styles.headerContainer}>
          <View style={{
            marginTop: 30,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <TouchableOpacity>
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontFamily: 'Roboto-Bold', color: '#FFF', fontSize: 15 }}>DEVSOUZA MAGAZINE</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', height: 100, marginTop: 10, justifyContent: 'space-around' }}>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', borderRadius: 5, padding: 10 }}>
                <Text style={{ fontFamily: 'Robo-Light', color: '#FFF' }}>7 dias</Text>
                <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View style={{ flexDirection: 'row', borderRadius: 5, padding: 10 }}>
                <Text style={{ fontFamily: 'Robo-Light', color: '#FFF' }}>Status da Venda</Text>
                <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View style={{ flexDirection: 'row', borderRadius: 5, padding: 10 }}>
                <Text style={{ fontFamily: 'Robo-Light', color: '#FFF' }}>Tipo de Frete</Text>
                <MaterialCommunityIcons name={'menu-down'} color={'#FFF'} size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, marginTop: 20, marginLeft: 20 }}>
          <CardSale title='Correio & Agencia' />
          <CardSale title='Correio & Agencia' />
          <CardSale title='Correio & Agencia' />
          <CardSale title='Correio & Agencia' />
          <CardSale title='Correio & Agencia' />
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  headerContainer: {
    flexDirection: 'column',
    padding: 20,
    backgroundColor: '#7994F5',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 120
  },
  greetingContainer: {
    marginLeft: 5,
    alignContent: 'center'
  },
  greetingSubText: {
    color: '#718093',
    fontFamily: 'Roboto-Thin',
  },
  greetingText: {
    color: '#2f3640',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});
