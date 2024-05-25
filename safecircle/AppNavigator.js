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
import ContactPage from './/screens/ContactScreens/ContactPage';
import ResourcesScreen from './screens/ResourcesScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import TabBar from './screens/TabBar';

// contacts, locations - grace testing

import ContactsScreen from './screens/ContactScreens/ContactPage_G';
import ShareLocationScreen from './screens/LocationScreens/ShareLocationScreen';

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
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TabBar" component={TabBar} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Contacts" component={ContactPage} />
        <Stack.Screen name="Resources" component={ResourcesScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
