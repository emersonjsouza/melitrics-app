import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from './views/dashboard/index';
import Filter from './views/dashboard/filter';
import Sales from './views/sales/index';
import Settings from './views/settings';
import Ads from './views/ads';

const screenSettings = {
  headerStyle: {
    backgroundColor: '#7994F5',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTintColor: '#FFF',
  headerShadowVisible: false,
  headerBackTitleVisible: false
};

const DashBoardStack = createNativeStackNavigator()
function DashboardStackScreen() {
  return <DashBoardStack.Navigator>
    <DashBoardStack.Screen options={({ route }) => ({
      ...screenSettings,
      headerShown: false,
    })}
      name="Dashboard" component={Dashboard} />
    <DashBoardStack.Screen options={({ route }) => ({
      ...screenSettings,
    })}
      name="Dashboard-Filter" component={Filter} />
  </DashBoardStack.Navigator>
}

const SalesStack = createNativeStackNavigator()
function SalesStackScreen() {
  return <SalesStack.Navigator>
    <SalesStack.Screen
      options={({ route }) => ({ ...screenSettings })}
      name="Sales" component={Sales} />
  </SalesStack.Navigator>
}

const ConfigStack = createNativeStackNavigator()
function ConfigStackScreen() {
  return <ConfigStack.Navigator>
    <ConfigStack.Screen
      options={({ route }) => ({ ...screenSettings })}
      name="Config" component={Settings} />
  </ConfigStack.Navigator>
}

const AdsStack = createNativeStackNavigator()
function AdsStackScreen() {
  return <AdsStack.Navigator>
    <AdsStack.Screen
      options={({ route }) => ({ ...screenSettings })}
      name="Config" component={Ads} />
  </AdsStack.Navigator>
}

const Tab = createBottomTabNavigator();
export default function () {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Gestão':
              iconName = 'view-dashboard';
              break
            case "Vendas":
              iconName = 'finance';
              break
            case "Anúncios":
              iconName = 'sitemap';
              break
            case "Configurações":
              iconName = 'cog';
              break
          }

          return <MaterialCommunityIcons name={iconName as string} color={color} size={size} />;
        },
        tabBarActiveTintColor: '#222222',
        tabBarInactiveTintColor: '#dcdde1',
        headerShown: false,
      })}>
      <Tab.Screen name="Gestão" component={DashboardStackScreen} />
      <Tab.Screen name="Vendas" component={SalesStackScreen} />
      <Tab.Screen name="Anúncios" component={AdsStackScreen} />
      <Tab.Screen name="Configurações" component={ConfigStackScreen} />
    </Tab.Navigator>
  );
}