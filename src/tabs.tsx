import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from './assets/color';
import Dashboard from './views/dashboard/index';
import Filter from './views/dashboard/filter';
import Sales from './views/sales/index';
import Settings from './views/settings';
import Ads from './views/ads';
import AdDetail from './views/ads/detail';
import Tax from './views/ads/tax';
import { useFeatureFlag, usePostHog } from 'posthog-react-native'
import { AppState } from 'react-native';

const screenSettings = {
  headerStyle: {
    backgroundColor: Colors.Main,
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
      name="Ads" component={Ads} />
    <AdsStack.Screen
      options={({ route }) => ({ ...screenSettings })}
      name="Ad" component={AdDetail} />
    <AdsStack.Screen
      options={({ route }) => ({ ...screenSettings })}
      name="Tax" component={Tax} />
  </AdsStack.Navigator>
}

const Tab = createBottomTabNavigator();
export default function ({ navigation }: any) {
  const settingUseFlag = useFeatureFlag('settings-menu')
  const posthog = usePostHog()
  const appState = React.useRef(AppState.currentState);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      if (appState.current == 'active') {
        posthog.reloadFeatureFlags()
      }
    });

    return () => {
      subscription.remove();
    };
  }, [])

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
      {settingUseFlag && <Tab.Screen name="Configurações" component={ConfigStackScreen} />}
    </Tab.Navigator>
  );
}