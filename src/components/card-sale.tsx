import React, { PropsWithChildren } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
} from 'react-native';

type CardProps = PropsWithChildren<{
  title: string,
  sku?: Number,
  totalAmount?: Number,
  tax?: Number,
  shipping?: Number,
  unit?: Number,
  isCanceled?: boolean
}>

export default function (props: CardProps): React.JSX.Element {
  return (
    <View
      style={styles.cardContainer}>
      <View>
        <Text style={styles.cardTitle}>LK-160 - Câmera Ip Segurança Wifi Wireless Espiã Anatel Onvif Noturna</Text>
        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, color: '#9C9C9C' }}>R$ 70,25</Text>
          <Text style={{ fontSize: 12, color: '#03933B', marginLeft: 2, }}>38,83%</Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 10, fontFamily: 'Robo-Thin', color: '#9C9C9C'}}>margem de contribuição</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
        <View style={{ borderWidth: .5, borderColor: '#9C9C9C', marginRight: 10, padding: 5, borderRadius: 10 }}><Text style={{ fontSize: 10, color: '#9C9C9C' }}>5 unid.</Text></View>
        <View style={{ borderWidth: .5, borderColor: '#9C9C9C', marginRight: 10, padding: 5, borderRadius: 10 }}><Text style={{ fontSize: 10, color: '#9C9C9C' }}>FULL</Text></View>
        <View style={{ borderWidth: .5, backgroundColor: '#03933B', borderColor: '#03933B', marginRight: 10, padding: 5, borderRadius: 10 }}><Text style={{ fontSize: 10, color: '#fff' }}>Aprovado</Text></View>
        <View style={{ borderWidth: .5, borderColor: '#9C9C9C', marginRight: 10, padding: 5, borderRadius: 10 }}><Text style={{ fontSize: 10, color: '#9C9C9C' }}>10/04/2024</Text></View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 20,
    borderRadius: 20,
    justifyContent: 'space-between',
    borderColor: '#ccc',
    borderWidth: 1,
    borderStartColor: '#03933B',
    borderStartWidth: 5,
    height: Platform.OS == 'android' ? 155 : 140, padding: 20,
    marginBottom: 10,
  },
  cardTitle: {
    width: '90%',
    fontSize: 12,
    color: '#212946',
    fontFamily: 'Roboto-Light',
  },
  cardUnitText: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Roboto-Thin',
  },
  cardTotalAmount: {
    fontFamily: 'Roboto-Medium',
    color: '#212946',
    fontSize: 15
  }
});
