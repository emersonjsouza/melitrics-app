
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../../context/AuthContext';
import { differenceInMinutes, toDate } from 'date-fns';
import { useSubscriptionMutation } from '../../../hooks/useSubscriptionMutation';
import { useQueryClient } from "@tanstack/react-query";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { CustomerInfo, PurchasesPackage, PurchasesStoreTransaction } from 'react-native-purchases';

export default function ({ navigation }: any): React.JSX.Element {
  const { logout, currentOrg } = useAuth()
  const [showBackButton, setShowBackButton] = useState(false)
  const [experisAt, setExpiresAt] = useState(0)
  const { mutateAsync } = useSubscriptionMutation()
  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentOrg) {
      const diffInMinutes = differenceInMinutes(toDate(currentOrg.subscription_expires_at), new Date())
      const diffInDays = differenceInMinutes(toDate(currentOrg.subscription_expires_at), new Date())
      setExpiresAt(diffInDays)
      setShowBackButton(diffInMinutes > 0)
    }

  }, [currentOrg])

  const onBack = () => {
    if (showBackButton) {
      if (currentOrg?.subscription_status == "authorized") {
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


  const onSubscriptionCallback = async (paymentResult: PAYWALL_RESULT, customerInfo?: CustomerInfo, storeTransaction?: PurchasesStoreTransaction) => {
    switch (paymentResult) {
      case PAYWALL_RESULT.RESTORED:
      case PAYWALL_RESULT.PURCHASED: {
        const product = customerInfo?.entitlements.all["pro"]

        const request = {
          expires_in: product?.expirationDateMillis as number,
          organization_id: String(currentOrg?.organization_id),
          plan_type: String(product?.productIdentifier),
          transaction_id: String(storeTransaction?.transactionIdentifier),
        }

        await mutateAsync(request)

        await queryClient.invalidateQueries({
          queryKey: ['user']
        })

        navigation.goBack()
      }
    }
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar translucent barStyle="light-content" />
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', marginTop: 15 }}>
            <TouchableOpacity onPress={onBack}>
              <View style={{ backgroundColor: '#1f1f1f', justifyContent: 'center', alignItems: 'center', width: 60, height: 60, borderRadius: 100 }}>
                <MaterialCommunityIcons name={'arrow-left'} color={'#fff'} size={20} />
              </View>
            </TouchableOpacity>
          </View>
          {/* <View style={{ marginHorizontal: 10, marginTop: 20, width: Dimensions.get('screen').width - 100, alignContent: 'center' }}>
            {experisAt < 0 && currentOrg?.subscription_status != "pending" && !showBackButton && <Text style={{ textAlign: 'center', fontSize: 14, color: '#FFF', flexWrap: 'wrap' }}>Seu plano {String(currentOrg?.subscription_type).length > 0 ? currentOrg?.subscription_type.toUpperCase() : "GRATUITO"} experiou, aproveite os valores promocionais e faça sua assinatura agora mesmo</Text>}
            {experisAt >= 0 && currentOrg?.subscription_status != "authorized" && showBackButton && <Text style={{ textAlign: 'center', fontSize: 14, color: '#FFF', flexWrap: 'wrap' }}>Seu plano gratuito expira em {experisAt} dias, aproveite os valores promocionais e faça sua assinatura agora mesmo</Text>}
            {experisAt >= 0 && currentOrg?.subscription_status == "authorized" && showBackButton && <Text style={{ textAlign: 'center', fontSize: 14, color: '#FFF', flexWrap: 'wrap' }}>Seu plano {currentOrg.subscription_type.toUpperCase()} expira em {experisAt} dias</Text>}
            {currentOrg?.subscription_status == "pending" && <Text style={{ textAlign: 'center', fontSize: 14, color: '#FFF', flexWrap: 'wrap' }}>Ainda não identificamos seu pagamento, se caso não efetou pagamento só clicar em assinar novamente, se caso já efetou por favor aguarde mais alguns minutos</Text>}
          </View> */}
        </View>

        <RevenueCatUI.Paywall
          onPurchaseCancelled={() => onSubscriptionCallback(PAYWALL_RESULT.CANCELLED)}
          onPurchaseCompleted={({ customerInfo, storeTransaction }) => onSubscriptionCallback(PAYWALL_RESULT.PURCHASED, customerInfo, storeTransaction)}
          onRestoreCompleted={({ customerInfo }) => onSubscriptionCallback(PAYWALL_RESULT.RESTORED, customerInfo)}
          onRestoreError={() => onSubscriptionCallback(PAYWALL_RESULT.ERROR)}
          style={{ flex: 1, height: 650, marginTop: 25 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#272727',
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) * 1.5 : 0,
  }
});

