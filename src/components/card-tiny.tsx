import React, { PropsWithChildren } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

type CardProps = PropsWithChildren<{
  title: string,
  amount: Number,
  unit: Number,
}>

export default function (props: CardProps): React.JSX.Element {
  return (
    <View
      style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{props.title}</Text>
      <Text style={styles.cardTotalAmount}>R$ {props.amount.toFixed(2)}</Text>
      <Text style={styles.cardUnitText}>{props.unit.toString()} unid.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#E5E5EE',
    marginRight: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: 135, height: 70, padding: 10
  },
  cardTitle: {
    fontSize: 12,
    color: '#212946',
    fontFamily: 'Roboto-Light',
  },
  cardUnitText: {
    marginTop: 3,
    fontSize: 10,
    color: '#212946',
    fontFamily: 'Roboto-Thin',
  },
  cardTotalAmount: {
    fontFamily: 'Roboto-Black',
    marginTop: 3,
    color: '#212946',
    fontSize: 15
  }
});
