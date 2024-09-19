import React, { PropsWithChildren } from 'react';
import Icon from "react-native-vector-icons/FontAwesome"
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type CheckboxProps = PropsWithChildren<{
  label?: string,
  labelStyle: object,
  iconColor: string
  onChange?: () => void
  value: boolean | null
  checkColor: string
}>

export default function CheckBox(props: CheckboxProps) {
  function handleChange() {
    const { onChange } = props;
    if (onChange) {
      return onChange();
    }
  }

  return (
    <View style={styles.WrapperCheckBox}>
      <Text style={[styles.LabelCheck, props.labelStyle]}>
        {props.label}
      </Text>

      <TouchableOpacity onPress={handleChange} style={[
        styles.CheckBox,
        { borderColor: props.checkColor ? props.checkColor : '#fff' }
      ]}>
        {
          props.value ? <Icon name="check"
            style={{
              fontSize: 16,
              color: props.iconColor ? props.iconColor : '#fff'
            }}
          /> : null
        }
      </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  CheckBox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  WrapperCheckBox: {
    flexDirection: "row",
    alignItems: "center"
  },
  LabelCheck: {
    color: '#fff',
    marginRight: 6
  }
})
