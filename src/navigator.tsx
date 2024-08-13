import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, StatusBar } from 'react-native'
import App from '../App';
import TabNavigator from './tabs';
import { Colors } from './assets/color';

const Stack = createStackNavigator();
export default function () {
  return (
    <NavigationContainer>
       <StatusBar translucent barStyle="light-content" backgroundColor={Platform.OS == 'ios' ? 'transparent' : Colors.Main} />
       <Stack.Navigator>
      <Stack.Screen name="App" component={App} options={{headerShown: false}} />
      <Stack.Screen name="Home" component={TabNavigator} options={{headerShown: false}} />
    </Stack.Navigator>
      </NavigationContainer>
  );
}