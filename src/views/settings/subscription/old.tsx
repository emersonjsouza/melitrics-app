
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  AppState
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../../context/AuthContext';
import { differenceInDays, toDate } from 'date-fns';
import { useSubscriptionMutation } from '../../../hooks/useSubscriptionMutation';
import { Modal } from '../../../components/modal';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import settings from '../../../settings';
import { useQueryClient } from "@tanstack/react-query";

export default function ({ navigation }: any): React.JSX.Element {
  const { userData, logout, currentOrg } = useAuth()
  const [showBackButton, setShowBackButton] = useState(false)
  const callbackURL = Platform.OS == 'ios' ? settings.MELI_PAGO_CONNECT_IOS : settings.MELI_PAGO_CONNECT_ANDROID
  const [experisAt, setExpiresAt] = useState(0)
  const { mutateAsync } = useSubscriptionMutation()
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const queryClient = useQueryClient();
  const appState = React.useRef(AppState.currentState);

  useEffect(() => {
    if (currentOrg) {
      const diff = differenceInDays(toDate(currentOrg.subscription_expires_at), new Date())
      setExpiresAt(diff)
      setShowBackButton(diff > 0)
    }

  }, [currentOrg])

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      appState.current = nextAppState;
      if (appState.current == 'active') {
        await queryClient.invalidateQueries({
          queryKey: ['user']
        })
      }
    });

    return () => {
      subscription.remove();
    };
  }, [])

  const onBack = () => {
    if (showBackButton) {
      if (currentOrg?.subscription_status == "authorized") {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Home",
            },
          ],
        });
      }
      else {
        navigation.goBack()
      }
    }
    else {
      Alert.alert("Atenção", "Você deseja realmente desconectar sua conta?", [{
        "text": "cancelar",
      }, {
        text: "Continuar",
        onPress: () => {
          logout(() => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "App",
                },
              ],
            });
          })
        }
      }])
    }
  }

  const onSubscription = async (type: 'expert' | 'up') => {
    setIsModalVisible(true)
    const resp = await mutateAsync({
      callback_url: callbackURL,
      plan_type: type,
      organization_id: String(currentOrg?.organization_id),
      user_id: userData.sub
    })

    setIsModalVisible(false)
    Linking.openURL(resp.payment_url)
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar translucent barStyle="light-content" backgroundColor={'#FFF'} />
      <Modal isVisible={isModalVisible}>
        <Modal.Container>
          <Modal.Body>
            <View style={{ height: 160, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ marginBottom: 20 }}>Estamos processando sua assinatura</Text>
              <ActivityIndicator size="large" color={Colors.Main} />
            </View>
          </Modal.Body>
        </Modal.Container>
      </Modal>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <TouchableOpacity onPress={onBack}>
            <View style={{ backgroundColor: '#1f1f1f', justifyContent: 'center', alignItems: 'center', width: 60, height: 60, borderRadius: 100 }}>
              <MaterialCommunityIcons name={'arrow-left'} color={'#fff'} size={20} />
            </View>
          </TouchableOpacity>
          <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>Gerenciar Assinatura</Text>
          </View>
        </View>
        <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
          {experisAt == 0 && currentOrg?.subscription_status != "pending" && !showBackButton && <Text style={{ textAlign: 'center', fontSize: 14, color: '#FFF', flexWrap: 'wrap' }}>Seu plano gratuito experiou, aproveite os valores promocionais e faça sua assinatura agora mesmo</Text>}
          {experisAt <= 10 && currentOrg?.subscription_status == "authorized" && showBackButton && <Text style={{ textAlign: 'center', fontSize: 14, color: '#FFF', flexWrap: 'wrap' }}>Seu plano gratuito expira em {experisAt} dias, aproveite os valores promocionais e faça sua assinatura agora mesmo</Text>}
          {experisAt > 10 && currentOrg?.subscription_status == "authorized" && showBackButton && <Text style={{ textAlign: 'center', fontSize: 14, color: '#FFF', flexWrap: 'wrap' }}>Seu plano {currentOrg.subscription_type.toUpperCase()} expira em {experisAt} dias</Text>}
          {currentOrg?.subscription_status == "pending" && <Text style={{ textAlign: 'center', fontSize: 14, color: '#FFF', flexWrap: 'wrap' }}>Ainda não identificamos seu pagamento, se caso não efetou pagamento só clicar em assinar novamente, se caso já efetou por favor aguarde mais alguns minutos</Text>}
        </View>
        {((currentOrg?.subscription_status == "authorized" && currentOrg.subscription_type == "expert") || currentOrg?.subscription_status != "authorized") &&
          <View style={{ height: 350, marginTop: 25, backgroundColor: '#92e546', borderRadius: 20 }}>
            <View style={{ padding: 20 }}>
              <View style={{ backgroundColor: '#000', width: 40, height: 40, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name={'rocket-launch-outline'} color={'#FFF'} size={25} />
              </View>
            </View>
            <View style={{ paddingHorizontal: 20, }}>
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 30 }}>Plano Expert</Text>
              <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                <MaterialCommunityIcons name={'check'} color={'#000'} size={13} />
                <Text style={{ marginLeft: 10, color: '#000', fontSize: 13 }}>até 1000 vendas mensais</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                <MaterialCommunityIcons name={'check'} color={'#000'} size={13} />
                <Text style={{ marginLeft: 10, color: '#000', fontSize: 13 }}>Gestão de Vendas</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                <MaterialCommunityIcons name={'check'} color={'#000'} size={13} />
                <Text style={{ marginLeft: 10, color: '#000', fontSize: 13 }}>Gestão de Tarifas e Custos</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                <MaterialCommunityIcons name={'check'} color={'#000'} size={13} />
                <Text style={{ marginLeft: 10, color: '#000', fontSize: 13 }}>Definição de metas de vendas</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                <MaterialCommunityIcons name={'check'} color={'#000'} size={13} />
                <Text style={{ marginLeft: 10, color: '#000', fontSize: 13 }}>Compartilhamento de acesso</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginLeft: 3, color: '#000', fontSize: 20, fontWeight: 700 }}>R$ 23,90</Text>
                <Text style={{ marginTop: 2, color: '#000', fontSize: 14 }}>/ mês</Text>
              </View>
              <TouchableOpacity onPress={() => onSubscription('expert')}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={{ marginLeft: 3, color: '#000', fontSize: 20, fontWeight: 400 }}>{currentOrg?.subscription_status == 'authorized' ? 'Cancelar' : 'Assinar'}</Text>
                  <MaterialCommunityIcons name={'chevron-right'} color={'#000'} size={20} />
                </View>
              </TouchableOpacity>
            </View>

            <Text style={{ textAlign: 'center', fontSize: 11, marginTop: 10, flexWrap: 'wrap' }}>* plano mais contratado por usuários do mercado livre</Text>
          </View>}

        {((currentOrg?.subscription_status == "authorized" && currentOrg.subscription_type == "up") || currentOrg?.subscription_status != "authorized") &&
          <View style={{ height: 300, marginTop: 30, backgroundColor: '#1a1e23', borderRadius: 20 }}>
            <View style={{ padding: 20 }}>
              <View style={{ backgroundColor: '#9cf4fd', width: 40, height: 40, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name={'chess-queen'} color={'#FFF'} size={25} />
              </View>
            </View>
            <View style={{ paddingHorizontal: 20, }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 30 }}>Plano Profissional</Text>
              <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                <MaterialCommunityIcons name={'check'} color={'#fff'} size={13} />
                <Text style={{ marginLeft: 10, color: '#fff', fontSize: 13 }}>até 100 vendas mensais</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                <MaterialCommunityIcons name={'check'} color={'#fff'} size={13} />
                <Text style={{ marginLeft: 10, color: '#fff', fontSize: 13 }}>Gestão de Vendas</Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                <MaterialCommunityIcons name={'check'} color={'#fff'} size={13} />
                <Text style={{ marginLeft: 10, color: '#fff', fontSize: 13 }}>Gestão de Tarifas e Custos</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginLeft: 3, color: '#fff', fontSize: 20, fontWeight: 700 }}>R$ 16,90</Text>
                <Text style={{ marginTop: 2, color: '#fff', fontSize: 14 }}>/ mês</Text>
              </View>
              <TouchableOpacity onPress={() => onSubscription('up')}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={{ marginLeft: 3, color: '#fff', fontSize: 20, fontWeight: 400 }}>{currentOrg?.subscription_status == 'authorized' ? 'Cancelar' : 'Assinar'}</Text>
                  <MaterialCommunityIcons name={'chevron-right'} color={'#fff'} size={20} />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 11, marginTop: 10, flexWrap: 'wrap' }}>ideal para que está começando</Text>
          </View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#000',
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) * 1.5 : 0,
  }
});

