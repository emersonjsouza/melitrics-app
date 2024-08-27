import React, { useEffect } from 'react';
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
import { Colors } from '../assets/color';
import { useAuth } from '../context/AuthContext';

function App(props: any): React.JSX.Element {
  const { login, loggedIn } = useAuth()

  const onSignIn = async () => {
    try {
      await login();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (loggedIn) {
      props.navigation.navigate('Home')
    }
  }, [loggedIn])

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle={'light-content'} />
      <ScrollView
        contentContainerStyle={styles.mainContainer}
        contentInsetAdjustmentBehavior="automatic">
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.logoText}>MELITRICS</Text>
          <Text style={{ color: '#fff' }}>Gestão Inteligente de Marketplaces</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.submit} onPress={onSignIn}>
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
    width: 180,
    height: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 80,
  },
  submitText: {
    color: Colors.Main,
    textAlign: 'center',
  }
});

export default App;
