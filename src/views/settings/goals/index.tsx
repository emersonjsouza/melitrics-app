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
import { Colors } from '../../../assets/color';
import { useQueryClient } from "@tanstack/react-query";
import { APIError, Goal } from '../../../services/types';
import { useAuth } from '../../../context/AuthContext';
import CurrencyInput from 'react-native-currency-input';
import { useGoal } from '../../../hooks/useGoal';
import { useGoalMutation } from '../../../hooks/useGoalMutation';

export default function ({ route, navigation }: any): React.JSX.Element {
  const { currentOrg } = useAuth()
  const { data } = useGoal({ organizationID: currentOrg?.organization_id })
  const queryClient = useQueryClient();
  const [inputRequest, setInputRequest] = useState<Goal>({
    day: 0,
    week: 0,
    biweekly: 0,
    month: 0,
  });

  const { mutateAsync, isPending } = useGoalMutation()

  useEffect(() => {
    setInputRequest({
      day: Number(data?.day),
      week: Number(data?.week),
      biweekly: Number(data?.biweekly),
      month: Number(data?.month),
    })
  }, [data])

  const onCreate = async () => {
    try {
      await mutateAsync({ tax: inputRequest, organization_id: String(currentOrg?.organization_id) })
      await queryClient.invalidateQueries({
        queryKey: ['goal']
      })

      Alert.alert('Sucesso!', 'Metas atualizadas com sucesso')
      navigation.navigate({
        name: 'Config',
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
      title: `Configurar meta de faturamento`,
    })
  }, [])

  return (
    <KeyboardAvoidingView style={styles.safeAreaContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Meta diária:</Text>
        <CurrencyInput
          value={inputRequest.day}
          onChangeValue={(day) => setInputRequest({ ...inputRequest, day: Number(day) })}
          prefix="R$"
          delimiter="."
          separator=","
          style={styles.input}
          precision={2}
          minValue={0}
        />
        <Text style={styles.label}>Meta semanal:</Text>
        <CurrencyInput
          value={inputRequest.week}
          onChangeValue={(week) => setInputRequest({ ...inputRequest, week: Number(week) })}
          prefix="R$"
          delimiter="."
          separator=","
          style={styles.input}
          precision={2}
          minValue={0}
        />
        <Text style={styles.label}>Meta quinzenal:</Text>
        <CurrencyInput
          value={inputRequest.biweekly}
          onChangeValue={(biweekly) => setInputRequest({ ...inputRequest, biweekly: Number(biweekly) })}
          prefix="R$"
          delimiter="."
          separator=","
          style={styles.input}
          precision={2}
          minValue={0}
        />
        <Text style={styles.label}>Meta mensal:</Text>
        <CurrencyInput
          value={inputRequest.month}
          onChangeValue={(month) => setInputRequest({ ...inputRequest, month: Number(month) })}
          prefix="R$"
          delimiter="."
          separator=","
          style={styles.input}
          precision={2}
          minValue={0}
        />

      </View>
      <View style={{ marginTop: 10 }}>
        <TouchableOpacity style={styles.register} onPress={onCreate} disabled={isPending}>
          {!isPending && <Text style={styles.submitText}>atualizar metas</Text>}
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

