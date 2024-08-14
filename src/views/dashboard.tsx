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
import { LineChart } from "react-native-chart-kit";
import CardTiny from '../components/card-tiny';
import CardInsight from '../components/card-insight';

export default function (): React.JSX.Element {
  return (
    <View style={{flex: 1, marginTop: 20, flexGrow: 1}}>
      <ScrollView
        contentContainerStyle={styles.mainContainer}
        showsVerticalScrollIndicator={true}
        contentInsetAdjustmentBehavior="automatic">
        <StatusBar barStyle={'dark-content'} backgroundColor={'#222222'} translucent />
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.profileContainer}>
              <Text style={styles.profileText}>DM</Text>
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingSubText}>Seja bem vindo,</Text>
              <Text style={styles.greetingText}>Angelica</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity>
              <MaterialCommunityIcons name={'eye-off-outline'} color={'#8D8E8D'} size={30} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: 10, marginLeft: 20 }}>
          <View style={styles.profitContainer}>
            <View>
              <Text style={{ fontFamily: 'Robo-Light' }}>Seu Faturamento</Text>
              <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 25, marginTop: 2 }}>R$ 62.233,93</Text>
            </View>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontFamily: 'Robo-Light', color: '#222222' }}>7 dias</Text>
                <MaterialCommunityIcons name={'menu-down'} color={'#222222'} size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 100, marginTop: 10 }}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ height: 100, marginTop: 20, marginLeft: 20, flexDirection: 'row' }}>
            <CardInsight
              title='Margem'
              amount={9321.52}
              amountInPercent={7.4}
              backgroundColor='#B0FF6D'
            />
            <CardInsight
              title='Custos e Impostos'
              amount={36607.22}
              backgroundColor='#64FFD3'
            />
            <CardInsight
              title='Ticket Médio'
              amount={120.80}
              amountInPercent={20.4}
              backgroundColor='#7994F5'
            />
          </ScrollView>
        </View>

        <Text style={{
          fontFamily: 'Roboto-Medium',
          marginTop: 20,
          color: '#212946',
          fontSize: 18,
          marginLeft: 20,
        }}>Minhas Operações</Text>
        <View
          style={{ marginTop: 20, marginLeft: 20, flexDirection: 'column' }}>
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
        </View>

        <View style={{ alignItems: 'center', height: 250 }}>
          <LineChart
            data={{
              labels: ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100
                  ]
                }
              ]
            }}
            width={Dimensions.get("window").width - 50} // from react-native
            height={220}
            yAxisLabel=""
            yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#64FFD3",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#64FFD3",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              },
              style: {
                padding: 100
              }
            }}
            bezier
            style={{
              marginVertical: 10,
              borderRadius: 16
            }}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginStart: 20,
    marginEnd: 20,
  },
  profileContainer: {
    backgroundColor: '#222222',
    width: 45, height: 45,
    padding: 2,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    alignSelf: 'center',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#FFF'
  },
  greetingContainer: {
    marginLeft: 5,
    alignContent: 'center'
  },
  profitContainer: {
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginStart: 20,
    marginEnd: 20,
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
