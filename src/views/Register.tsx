import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Colors } from '../assets/color';
import { useSignUp } from '../hooks/useSignup';
import { APIError } from '../services/types';

function App(props: any): React.JSX.Element {
  const [inputRequest, setInputRequest] = useState<{ full_name: string, email: string, company_name: string, password: string }>({
    full_name: '',
    email: '',
    company_name: '',
    password: ''
  });

  const { mutateAsync, error, isPending } = useSignUp()
  const onSignUp = async () => {
    const names = inputRequest.full_name.split(' ')
    if (names.length == 1) {
      Alert.alert('Atenção!', 'Informe o seu nome completo')
      return
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;

    if (!passwordRegex.test(inputRequest.password)) {
      Alert.alert('Atenção!', 'Sua senha deve conter letras maisculas e minusculas, números e um caracter especial')
      return
    }

    const payload = {
      ...inputRequest,
      given_name: names[0],
      family_name: names[1],
    }

    try {
      await mutateAsync(payload)
      Alert.alert('Sucesso!', 'Sua conta foi criada com sucesso')
      props.navigation.navigate('App')
    } catch (err: unknown) {
      console.log('generic.error=>>', err)
      
      if (err as APIError) {
        const errorMessage = (err as APIError).response?.data?.error
        console.log('api.error=>>', errorMessage)

        if (errorMessage?.indexOf("already exists") && errorMessage?.startsWith("user")) {
          Alert.alert('Alerta!', 'E-mail já cadastrado, informe outro e-mail')
          return
        }
        if (errorMessage?.indexOf("organizations_name_key") && errorMessage?.indexOf("organizations_name_key") > -1) {
          Alert.alert('Alerta!', 'Já existe uma empresa com esse nome, por favor informe outro nome')
          return
        }

        Alert.alert('Alerta!', 'Ocorreu um erro ao criar sua conta, tente novamente')
      }
    }
  }

  return (
    <KeyboardAvoidingView style={styles.safeAreaContainer}>
      <StatusBar barStyle={'dark-content'} />
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.logoText}>MELITRICS</Text>
        <Text style={{ color: Colors.Main, marginTop: 5, flexWrap: 'wrap', width: Dimensions.get('window').width * .8, textAlign: 'center' }}>Cadastre-se grátis e comece gerenciar suas empresas agora mesmo</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          placeholderTextColor={'#CCC'}
          returnKeyType={'next'}
          value={inputRequest.company_name}
          onChangeText={(company_name) => setInputRequest({ ...inputRequest, company_name })}
          placeholder="Nome da Empresa"
          style={styles.input}
        />

        <TextInput
          placeholderTextColor={'#CCC'}
          returnKeyType={'next'}
          value={inputRequest.full_name}
          onChangeText={(full_name) => setInputRequest({ ...inputRequest, full_name })}
          placeholder="Nome Completo"
          style={styles.input}
        />

        <TextInput
          placeholderTextColor={'#CCC'}
          returnKeyType={'next'}
          value={inputRequest.email}
          onChangeText={(email) => setInputRequest({ ...inputRequest, email })}
          textContentType={'emailAddress'}
          autoCapitalize='none'
          placeholder="Email"
          style={styles.input}
        />

        <TextInput
          placeholderTextColor={'#CCC'}
          returnKeyType={'next'}
          value={inputRequest.password}
          secureTextEntry={true}
          onChangeText={(password) => setInputRequest({ ...inputRequest, password })}
          placeholder="Senha"
          style={styles.input}
        />
      </View>
      <View>
        <TouchableOpacity style={styles.signButton} disabled={isPending} onPress={onSignUp}>
          {!isPending && <Text style={styles.submitText}>criar conta gratuita</Text>}
          {isPending && <ActivityIndicator size="large" color={'#fff'} />}
        </TouchableOpacity>
        <TouchableOpacity onPressIn={() => props.navigation.navigate('App')} style={styles.signUpButton}>
          <Text style={styles.signUpText}>Já tenho uma conta</Text>
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
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.Main,
    borderColor: Colors.Main,
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
