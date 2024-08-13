import React, { PropsWithChildren } from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
} from 'react-native';

type CardProps = PropsWithChildren<{
  title: string,
  amount: Number,
  backgroundColor: string,
  imageUri: ImageSourcePropType
}>

export default function (props: CardProps): React.JSX.Element {
  return (
    <ImageBackground source={props.imageUri}
      style={{ backgroundColor: props.backgroundColor, ...styles.cardContainer }}>
      <Text style={styles.cardTitle}>{props.title}</Text>
      <Text style={styles.cardTotalAmount}>R$ {props.amount.toFixed(2)}</Text>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 20,
    borderBottomRightRadius: 20,
    width: 135, height: 170, padding: 10, paddingTop: 30
  },
  cardTitle: {
    fontSize: 12,
    color: '#212946',
    fontFamily: 'Roboto-Light',
  },
  cardTotalAmount: {
    fontFamily: 'Roboto-Black',
    marginTop: 10,
    color: '#212946',
    fontSize: 15
  }
});
