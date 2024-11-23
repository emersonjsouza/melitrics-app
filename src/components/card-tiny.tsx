import React, { PropsWithChildren } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { formatToBRL } from '../utils';

type CardProps = PropsWithChildren<{
  title: string,
  amount: number,
  amount_sold?: number,
  amount_unit?: number,
}>

export default function (props: CardProps): React.JSX.Element {
  return (
    <View
      style={styles.cardContainer}>
      <View>
        <Text style={styles.cardTitle}>{props.title}</Text>
        <Text style={styles.cardTotalAmount}>{formatToBRL(props.amount)}</Text>
      </View>
      <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
        <Text style={styles.cardUnitText}>{props.amount_sold?.toString()} vendas</Text>
        {props.amount_unit && <Text style={styles.cardUnitText}>{props.amount_unit?.toString()} unidades</Text>}
      </View>
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
    borderStartColor: '#34495e',
    borderStartWidth: 10,
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
