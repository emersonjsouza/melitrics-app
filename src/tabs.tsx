import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Dashboard from './views/dashboard';
import Sales from './views/sales';

const screenSettings = {
  headerStyle: {
    backgroundColor: '#222222',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTintColor: '#222222',
  headerBackTitleVisible: false
};

const DashBoardStack = createStackNavigator()
function DashboardStackScreen() {
  return <DashBoardStack.Navigator>
    <DashBoardStack.Screen options={({ route }) => ({
      ...screenSettings,
      headerShown: false,
    })}
      name="Gestão Operacional" component={Dashboard} />
  </DashBoardStack.Navigator>
}

const SalesStack = createStackNavigator()
function SalesStackScreen() {
  return <SalesStack.Navigator>
    <SalesStack.Screen options={({ route }) => ({
      ...screenSettings,
      headerShown: false,
    })}
      name="Vendas" component={Sales} />
  </SalesStack.Navigator>
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
            case "Estoque":
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
      <Tab.Screen name="Vendas" component={Sales} />
      <Tab.Screen name="Estoque" component={Dashboard} />
      <Tab.Screen name="Configurações" component={Dashboard} />
    </Tab.Navigator>
  );
}