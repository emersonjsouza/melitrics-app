
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import TabNavigator from './tabs';
import App from './views/App';
import Register from './views/Register';
import Connect from './views/Connect';
import { AuthContextProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Platform, StatusBar } from 'react-native';
import { Colors } from './assets/color';
import { createStackNavigator } from '@react-navigation/stack';

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
    prefixes: ['https://melitrics.com', 'org.reactjs.native.example.melitricsapp://', 'melitricsapp://melitricsapp'],
    config: {
      screens: {
        connect: 'connect/:code',
      },
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <NavigationContainer linking={linking}>
          <StatusBar translucent barStyle="light-content" backgroundColor={Platform.OS == 'ios' ? 'transparent' : Colors.Main} />
          <Stack.Navigator initialRouteName='App'>
            <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            <Stack.Screen name="connect" component={Connect} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

