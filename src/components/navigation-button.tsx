import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function (props: { icon: string }) {
  return (<TouchableOpacity>
    <View style={styles.navigationButton}>
      <MaterialCommunityIcons name={props.icon} color={'#FFF'} size={25} />
    </View>
  </TouchableOpacity>)
}

const styles = StyleSheet.create({
  navigationButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50
  }
});
