import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  View,
  TouchableOpacity
} from 'react-native';
import { Colors } from './src/assets/color';

function App(props: any): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle={'light-content'}/>
      <ScrollView
        contentContainerStyle={styles.mainContainer}
        contentInsetAdjustmentBehavior="automatic">
        <View style={{flex: 1, alignItems:'center'}}>
          <Text style={styles.logoText}>MELITRICS</Text>
          <Text style={{color: '#fff'}}>Gestão Inteligente de Marketplaces</Text>
        </View>
        <View>
        <TouchableOpacity style={styles.submit} onPress={()=>  props.navigation.navigate('Home')}>
            <Text style={styles.submitText}>acessar minha conta</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: Colors.Main,
    flex: 1,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) * 1.5 : 0,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  logoText: {
    marginTop: 80,
    fontSize: 30,
    color: '#FFF',
    fontWeight: 'bold',
  },
  submit: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    alignSelf: 'flex-end',
    marginBottom: 80,
  },
  submitText: {
    color: Colors.Main,
    textAlign: 'center',
  }
});

export default App;
