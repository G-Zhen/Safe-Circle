import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import LandingScreen from './screens/LandingScreen';
import Instructions from './screens/Instructions';
import KeyFeatures from './screens/KeyFeatures';
import AllowNotifications from './screens/OnboardingScreens/AllowNotifications';
import AllowLocationShare from './screens/OnboardingScreens/AllowLocationShare';
import AllowContactAccess from './screens/OnboardingScreens/AllowContactAccess';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        
        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Instructions" component={Instructions} options={{ headerShown: false }} />
        <Stack.Screen name="KeyFeatures" component={KeyFeatures} options={{ headerShown: false }} />
        <Stack.Screen name="AllowNotifications" component={AllowNotifications} options={{ headerShown: false }} />
        <Stack.Screen name="AllowLocationShare" component={AllowLocationShare} options={{ headerShown: false }} />
        <Stack.Screen name="AllowContactAccess" component={AllowContactAccess} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}


