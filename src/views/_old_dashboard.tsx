import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import CardInsights from '../components/card-insights';
import CardTiny from '../components/card-tiny';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function (): React.JSX.Element {
  return (
    <ScrollView
      contentContainerStyle={styles.mainContainer}
      contentInsetAdjustmentBehavior="automatic">
      <View style={styles.headerContainer}>
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>DM</Text>
        </View>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingSubText}>Boa noite</Text>
          <Text style={styles.greetingText}>Angelica Pinheiro</Text>
        </View>
      </View>
      <ScrollView
        horizontal={true}
        style={{ maxHeight: 180 }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 20, marginLeft: 20, flexDirection: 'row' }}>
        <CardInsights
          title='Faturamento'
          amount={62233.93}
          backgroundColor='#BE9BC7'
          amountInPercent={20.4}
          imageUri={require('../assets/images/bg1.png')}
        />
        <CardInsights
          title='Custos e Impostos'
          amount={36607.22}
          backgroundColor='#B16439'
          amountInPercent={10.4}
          imageUri={require('../assets/images/bg2.png')}
        />
        <CardInsights
          title='Margem de Contribuição'
          amount={9321.52}
          amountInPercent={7.4}
          backgroundColor='#079992'
          imageUri={require('../assets/images/bg3.png')}
        />
      </ScrollView>
      <Text style={{
        fontFamily: 'Roboto-Medium',
        marginTop: 10,
        color: '#212946',
        fontSize: 18,
        marginLeft: 20,
      }}>Minhas Operações</Text>
      <ScrollView
        horizontal={true}
        style={{ maxHeight: 100 }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 20, marginLeft: 20, flexDirection: 'row' }}>
        <CardTiny
          title='Correio & Agencia'
          amount={62233.93}
          unit={20}
        />
        <CardTiny
          title='Flex'
          amount={36607.22}
          unit={10}
        />
        <CardTiny
          title='Full'
          amount={9321.52}
          unit={120}
        />
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{
          fontFamily: 'Roboto-Medium',
          marginTop: 10,
          color: '#212946',
          fontSize: 18,
          marginLeft: 20,
        }}>Últimas vendas</Text>
        <TouchableOpacity>
          <Text style={{
            fontFamily: 'Roboto-Light',
            marginTop: 10,
            color: '#212946',
            fontSize: 14,
            marginRight: 20,
          }}>Ver todas</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  profileContainer: {
    backgroundColor: '#BE9BC7',
    width: 45, height: 45,
    padding: 2,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  profileText: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 600,
    color: '#FFF'
  },
  greetingContainer: {
    marginLeft: 5,
    alignContent: 'center'
  },
  greetingSubText: {
    color: '#718093'
  },
  greetingText: {
    color: '#2f3640',
    fontSize: 16,
    fontWeight: 'bold'
  },
});
