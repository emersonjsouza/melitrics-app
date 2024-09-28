
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  Platform,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ({ navigation }: any): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar translucent barStyle="light-content" backgroundColor={'#FFF'} />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{ backgroundColor: '#1f1f1f', justifyContent: 'center', alignItems: 'center', width: 60, height: 60, borderRadius: 100 }}>
              <MaterialCommunityIcons name={'arrow-left'} color={'#fff'} size={20} />
            </View>
          </TouchableOpacity>
          <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>Gerenciar Assinatura</Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center', fontSize: 14,  color: '#FFF', flexWrap: 'wrap' }}>Seu plano gratuito expira em 20 dias, aproveite os valores promocionais e faça sua assinatura agora mesmo</Text>
        </View>
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
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={{ marginLeft: 3, color: '#000', fontSize: 20, fontWeight: 400 }}>Assinar</Text>
              <MaterialCommunityIcons name={'chevron-right'} color={'#000'} size={20} />
            </View>
          </View>

          <Text style={{ textAlign: 'center', fontSize: 11, marginTop: 10, flexWrap: 'wrap' }}>* plano mais contratado por usuários do mercado livre</Text>
        </View>

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
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={{ marginLeft: 3, color: '#fff', fontSize: 20, fontWeight: 400 }}>Assinar</Text>
              <MaterialCommunityIcons name={'chevron-right'} color={'#fff'} size={20} />
            </View>
          </View>
          <Text style={{ textAlign: 'center', color: '#fff', fontSize: 11, marginTop: 10, flexWrap: 'wrap' }}>ideal para que está começando</Text>
        </View>
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

