import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, StatusBar } from 'react-native'
import TabNavigator from './tabs';
import { Colors } from './assets/color';
import App from './views/App';
import { AuthContextProvider } from './context/AuthContext';

const Stack = createStackNavigator();
export default function () {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <StatusBar translucent barStyle="light-content" backgroundColor={Platform.OS == 'ios' ? 'transparent' : Colors.Main} />
        <Stack.Navigator>
          <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContextProvider>
  );
}

