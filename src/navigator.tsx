import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, StatusBar } from 'react-native'
import TabNavigator from './tabs';
import { Colors } from './assets/color';
import App from './views/App';
import Register from './views/Register';
import Connect from './views/Connect';
import { AuthContextProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <NavigationContainer>
          <StatusBar translucent barStyle="light-content" backgroundColor={Platform.OS == 'ios' ? 'transparent' : Colors.Main} />
          <Stack.Navigator>
            <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            <Stack.Screen name="Connect" component={Connect} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

