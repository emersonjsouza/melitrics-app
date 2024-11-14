import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function (props: { icon: string, onPress?: () => void }) {
  return (<TouchableOpacity onPress={props.onPress}>
    <View style={styles.navigationButton}>
      <MaterialCommunityIcons name={props.icon} color={'#FFF'} size={20} />
    </View>
  </TouchableOpacity>)
}

const styles = StyleSheet.create({
  navigationButton: {
    alignItems: "flex-end",
    justifyContent: "center",
    height: 30,
    width: 30
  }
});
