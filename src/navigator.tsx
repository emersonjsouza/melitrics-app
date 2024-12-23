
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
import { useEffect, useRef } from 'react';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { firebase } from '@react-native-firebase/analytics';

// @ts-ignore
import { REVENUE_CAT_APPLE_KEY, ONESIGNAL_APP_KEY, POSTHOG_APP_KEY } from "@env"

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

  const navigationRef = useRef<any>();
  const routeNameRef = useRef();

  useEffect(() => {
    Purchases.configure({
      apiKey: REVENUE_CAT_APPLE_KEY
    });

    OneSignal.initialize(ONESIGNAL_APP_KEY);
    OneSignal.Notifications.requestPermission(true);
    OneSignal.Notifications.addEventListener('click', async (event) => {
      console.log("push.event", event)
    });
  }, [])



  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer linking={linking}
        ref={navigationRef}
        onReady={() =>
          (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
        }
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            await firebase.analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName
            });
          }
          
          routeNameRef.current = currentRouteName;
        }}
      >
        <PostHogProvider apiKey={POSTHOG_APP_KEY} autocapture>
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
