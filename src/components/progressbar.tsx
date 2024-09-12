import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../assets/color';

const ProgressBar = (props: any) => {
  const [progress, setProgress] = useState<Animated.Value>(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 75,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, { width: progress }]} />
      <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 10, color: Colors.TextColor }}>
        Você já está próximo da sua meta de faturamento de R$ 5.000,00
      </Text>
    </View>
  );
};

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
    backgroundColor: Colors.PremiumColor,
    borderRadius: 10,
  },
});

export default ProgressBar;