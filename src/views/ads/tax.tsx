import React, { forwardRef, PropsWithChildren, useEffect, useImperativeHandle, useLayoutEffect, useState } from 'react';
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
import { APIError, Tax, TaxRegister } from '../../services/types';
import { useAuth } from '../../context/AuthContext';
import CurrencyInput from 'react-native-currency-input';
import CheckBox from '../../components/checkbox';
import { Modal } from '../../components/modal';
import { useTaxes } from '../../hooks/useTaxes';

type Props = PropsWithChildren<{
  itemID?: string
  taxID?: string
  defaultSku?: string
  externalItemID: string,
  callback?: () => void
}>

export default forwardRef(({ itemID, taxID, externalItemID, callback }: Props, ref) => {

  const { currentOrg } = useAuth()
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { refetch } = useTaxes({
    organizationID: currentOrg?.organization_id || '',
    externalItemID: externalItemID || '',
    taxID: taxID || '',
  })

  useImperativeHandle(ref, () => ({
    show: async () => {
      setIsModalVisible(true)
      const response = await refetch()

      const data = response.data?.items[0] || null
      if (data) {
        setInputRequest((value) => ({
          ...value,
          cost: data?.cost || null,
          tax_rate: data?.tax_rate || null,
          charge_flex_sales: data?.charge_flex_sales || null
        }))
      }
    },
  }));

  const defaultTax = {
    organization_id: currentOrg?.organization_id || '',
    external_item_id: externalItemID,
    tax_id: taxID,
    cost: 0,
    tax_rate: 0,
    charge_flex_sales: false,
  }

  const [inputRequest, setInputRequest] = useState<TaxRegister>(defaultTax);

  const { mutateAsync, isPending } = useTaxMutation()

  const onCreate = async () => {
    if (!inputRequest?.cost && !inputRequest?.tax_rate) {
      Alert.alert('Atenção!', 'Informe o valor de custo ou imposto')
      return
    }

    try {
      
      await mutateAsync(inputRequest)
      if (callback) {
        callback()
      }

      Alert.alert('Sucesso!', taxID ? 'Custos atualizado com sucesso' : 'Custos cadastrado com sucesso')
      setIsModalVisible(false)
    } catch (err: unknown) {
      if (err as APIError) {
        Alert.alert('Alerta!', 'Ocorreu um erro ao cadastrar os custos, tente novamente')
      }
    }
  }

  return (
    <Modal isVisible={isModalVisible}>
      <Modal.Container>
        <Modal.Header title='Custos & Impostos' />
        <Modal.Body>
          <View style={{ height: 280 }}>
            <KeyboardAvoidingView style={styles.safeAreaContainer}>
              <View style={styles.formContainer}>
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
                  {!isPending && <Text style={styles.submitText}>SALVAR INFORMAÇÕES</Text>}
                  {isPending && <ActivityIndicator size="large" color={'#fff'} />}
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView >
          </View>
        </Modal.Body>
        <Modal.Footer>
          <TouchableOpacity onPress={() => {
            setInputRequest(defaultTax)
            setIsModalVisible(false)
          }}>
            <Text>Fechar</Text>
          </TouchableOpacity>
        </Modal.Footer>
      </Modal.Container>
    </Modal >
  );
})

const styles = StyleSheet.create({
  label: { color: Colors.TextColor, fontSize: 16 },
  safeAreaContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
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

