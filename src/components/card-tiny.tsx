import React, { PropsWithChildren } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

type CardProps = PropsWithChildren<{
  title: string,
  amount: Number,
  amount_sold?: Number,
}>

export default function (props: CardProps): React.JSX.Element {
  return (
    <View
      style={styles.cardContainer}>
      <View>
        <Text style={styles.cardTitle}>{props.title}</Text>
        <Text style={styles.cardTotalAmount}>R$ {props.amount.toFixed(2)}</Text>
      </View>
      <Text style={styles.cardUnitText}>{props.amount_sold?.toString()} vendas</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ECEAEA',
    marginRight: 20,
    borderRadius: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderStartColor: '#64FFD3',
    borderStartWidth:  10,
    height: 70, padding: 20,
    marginBottom: 10,
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
