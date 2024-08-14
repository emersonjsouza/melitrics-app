import React, { PropsWithChildren } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

type CardProps = PropsWithChildren<{
  title: string,
  amount: Number,
  amountInPercent?: Number,
  backgroundColor: string
}>

export default function (props: CardProps): React.JSX.Element {
  return (
    <View
      style={{ ...styles.cardContainer, backgroundColor: props.backgroundColor }}>
      <Text style={styles.cardTitle}>{props.title}</Text>
      <Text style={styles.cardTotalAmount}>R$ {props.amount.toFixed(2)}</Text>
      {(props.amountInPercent as number) > 0 && <Text style={styles.cardUnitText}>{props.amountInPercent?.toString()} %</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: 140, height: 80, padding: 10
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
