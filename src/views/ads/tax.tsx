import React, { useEffect, useLayoutEffect, useState } from 'react';
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
import { Colors } from '../../assets/color';
import { useTaxMutation } from '../../hooks/useTaxMutation';
import { APIError, TaxRegister } from '../../services/types';
import { useAuth } from '../../context/AuthContext';
import CurrencyInput from 'react-native-currency-input';
import { useTax } from '../../hooks/useTax';
import CheckBox from '../../components/checkbox';

export default function ({ route, navigation }: any): React.JSX.Element {
  const { itemID, taxID } = route?.params
  const { currentOrg } = useAuth()
  const { data, isFetching } = useTax({ organizationID: currentOrg?.organization_id, id: taxID })

  console.log('data', data)

  const [inputRequest, setInputRequest] = useState<TaxRegister>({
    organization_id: currentOrg?.organization_id || '',
    cost: 0,
    sku: '',
    item_id: itemID,
    tax_rate: 0,
    charge_flex_sales: false,
  });

  const { mutateAsync, isPending } = useTaxMutation()

  useEffect(() => {
    setInputRequest((value) => ({
      ...value,
      cost: data?.cost || null,
      tax_rate: data?.tax_rate || null,
      sku: data?.sku || '',
      charge_flex_sales: data?.charge_flex_sales || null
    }))
  }, [data])

  const onCreate = async () => {
    if (!inputRequest?.cost && !inputRequest?.tax_rate) {
      Alert.alert('Atenção!', 'Informe o valor de custo ou imposto')
      return
    }

    if (!inputRequest?.sku) {
      Alert.alert('Atenção!', 'Informe o SKU do produto')
      return
    }

    try {
      console.log('inputRequest', inputRequest)
      await mutateAsync(inputRequest)
      Alert.alert('Sucesso!', taxID ? 'Custos atualizado com sucesso' : 'Custos cadastrado com sucesso')
      navigation.navigate({
        name: 'Ad',
        params: { tax: inputRequest },
        merge: true,
      });
    } catch (err: unknown) {
      if (err as APIError) {
        Alert.alert('Alerta!', 'Ocorreu um erro ao cadastrar os custos, tente novamente')
      }
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Cadastrar Custos e Imposto`,
    })
  }, [])

  return (
    <KeyboardAvoidingView style={styles.safeAreaContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>SKU:</Text>
        <TextInput
          placeholderTextColor={'#CCC'}
          returnKeyType={'next'}
          value={inputRequest.sku}
          onChangeText={(sku) => setInputRequest({ ...inputRequest, sku })}
          style={styles.input}
        />

        <Text style={styles.label}>Custo do Produto:</Text>
        <CurrencyInput
          value={inputRequest.cost}
          onChangeValue={(cost) => setInputRequest({ ...inputRequest, cost: cost })}
          prefix="R$"
          delimiter="."
          separator=","
          style={styles.input}
          precision={2}
          minValue={0}
        />

        <Text style={styles.label}>Imposto:</Text>
        <CurrencyInput
          value={inputRequest.tax_rate}
          onChangeValue={(tax_rate) => setInputRequest({ ...inputRequest, tax_rate })}
          suffix="%"
          delimiter="."
          separator=","
          style={styles.input}
          precision={2}
          minValue={0}
        />

        <CheckBox
          label='Não Incide imposto em vendas Flex:'
          labelStyle={styles.label}
          iconColor={Colors.TextColor}
          checkColor={Colors.TextColor}
          value={inputRequest.charge_flex_sales}
          onChange={() => {
            setInputRequest((value: TaxRegister) => ({ ...value, charge_flex_sales: !value.charge_flex_sales }))
          }}
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <TouchableOpacity style={styles.register} onPress={onCreate} disabled={isPending}>
          {!isPending && <Text style={styles.submitText}>{taxID ? 'atualizar' : 'cadastrar'}</Text>}
          {isPending && <ActivityIndicator size="large" color={'#fff'} />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  label: { color: Colors.TextColor, fontSize: 16 },
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
  register: {
    width: Dimensions.get('screen').width * .8,
    height: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.Main,
    borderColor: Colors.Main,
    borderRadius: 10,
    borderWidth: 1,
  },
  submitText: {
    color: '#FFF',
    textAlign: 'center',
  }
});

