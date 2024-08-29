import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function (props: { icon: string, label: string }) {
  return (<TouchableOpacity>
    <View style={styles.filterButton}>
      <Text style={styles.filterButtonText}>{props.label}</Text>
      <MaterialCommunityIcons name={props.icon} color={'#FFF'} size={20} />
    </View>
  </TouchableOpacity>)
}

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    borderRadius: 5,
    padding: 10
  },
  filterButtonText: {
    fontFamily: 'Robo-Light',
    color: '#FFF'
  }
});
