import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { Colors } from '../assets/color';
import { useAuth } from '../context/AuthContext';

function App(props: any): React.JSX.Element {
  const { userData } = useAuth()

  const onConnect = () => {
    Linking.openURL(`https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=666608762505712&redirect_uri=https://melitrics-core.onrender.com/mercadolivre/callback`)
  }

  return (
    <KeyboardAvoidingView style={styles.safeAreaContainer}>
      <StatusBar barStyle={'dark-content'} />
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.logoText}>MELITRICS</Text>

      </View>
      <View style={{ marginTop: Dimensions.get('screen').height * 0.2, flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: '#718093', marginVertical: 10, flexWrap: 'wrap', fontWeight: 600, width: Dimensions.get('window').width * .8, textAlign: 'left' }}>FALTA SÓ UM PASSO 😋</Text>
          <Text style={{ color: '#718093', flexWrap: 'wrap', width: Dimensions.get('window').width * .8, textAlign: 'left' }}>Você ainda não possui nenhuma conta do Mercado Livre conectado</Text>

          <TouchableOpacity style={styles.signButton} onPress={onConnect}>
            <Text style={styles.submitText}>Conectar ao Mercado Livre</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPressIn={() => props.navigation.navigate('App')} style={styles.signUpButton}>
          <Text style={styles.signUpText}>desconectar minha conta</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) * 1.5 : 0,
  },
  formContainer: {
    marginTop: 30,
    marginHorizontal: 15,
  },
  input: {
    borderRadius: 10,
    borderColor: '#f2f2f2',
    borderWidth: 1.2,
    paddingLeft: 10,
    marginBottom: 10,
    width: Dimensions.get('window').width * .8,
    height: 45
  },
  logoText: {
    marginTop: 80,
    fontSize: 30,
    color: Colors.Main,
    fontWeight: 'bold',
  },
  signButton: {
    width: Dimensions.get('screen').width * .8,
    height: 50,
    marginTop: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#f8d347',
    borderColor: '#f8d347',
    borderRadius: 10,
    borderWidth: 1,
  },
  signUpButton: {
    width: Dimensions.get('screen').width * .8,
    height: 50,
    marginTop: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 10,
  },
  signUpText: {
    color: Colors.Main,
    textAlign: 'center',
  },
  submitText: {
    color: '#FFF',
    textAlign: 'center',
  }
});

export default App;
