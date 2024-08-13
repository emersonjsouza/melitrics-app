import React from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function (): React.JSX.Element {
  return (
    <ScrollView
      contentContainerStyle={styles.mainContainer}
      contentInsetAdjustmentBehavior="automatic">
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  }
});
