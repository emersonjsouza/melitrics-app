import React, { useState, useEffect, PropsWithChildren, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../assets/color';


type ProgressProps = PropsWithChildren<{
  label?: string
}>


export default forwardRef((props: ProgressProps, ref) => {
  const [progress, setProgress] = useState<Animated.Value>(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: progress,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useImperativeHandle(ref, () => ({
    setOnProgress: async (value: number) => {
      setProgress(new Animated.Value(value))
    },
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, { width: progress }]} />
      <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 10, color: Colors.TextColor }}>
        {props.label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
    margin: 10,
    marginTop: 20,
  },
  bar: {
    height: 20,
    backgroundColor: '#27ae60',
    borderRadius: 10,
  },
});

