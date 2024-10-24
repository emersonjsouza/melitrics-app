
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './tabs';
import App from './views/App';
import Register from './views/Register';
import Connect from './views/Connect';
import { AuthContextProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Platform, StatusBar } from 'react-native';
import { Colors } from './assets/color';
import { createStackNavigator } from '@react-navigation/stack';
import { PostHogProvider } from 'posthog-react-native'
import subscription from './views/settings/subscription';
import { useEffect } from 'react';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

// @ts-ignore
import { REVENUE_CAT_APPLE_KEY } from "@env"

const Stack = createStackNavigator();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function () {
  const linking = {
    prefixes: ['https://melitrics.com', 'com.melitrics://', 'melitricsapp://melitricsapp'],
    config: {
      screens: {
        connect: 'connect/:code',
      },
    },
  };

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === 'ios') {
      Purchases.configure({
        apiKey: REVENUE_CAT_APPLE_KEY
      });
    } else if (Platform.OS === 'android') {
      Purchases.configure({
        apiKey: ""
      });
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer linking={linking}>
        <PostHogProvider apiKey="phc_R4CQAoEm9S8jtON1YhzO9VmhYqkRHBrrW3cvjkI5tJ0" autocapture>
          <AuthContextProvider>
            <StatusBar translucent barStyle="light-content" backgroundColor={Platform.OS == 'ios' ? 'transparent' : Colors.Main} />
            <Stack.Navigator initialRouteName='App'>
              <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
              <Stack.Screen name="connect" component={Connect} options={{ headerShown: false }} />
              <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
              <Stack.Screen name="subscription" component={subscription} options={{ headerShown: false }} />
            </Stack.Navigator>
          </AuthContextProvider>
        </PostHogProvider>
      </NavigationContainer>
    </QueryClientProvider >
  );
}
