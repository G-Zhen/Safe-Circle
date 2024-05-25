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
import SingleContactPage from './screens/ContactScreens/SingleContactPage';
import ResourcesScreen from './screens/ResourcesScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import TabBar from './screens/TabBar';
import { StatusProvider } from './screens/StatusContext';


// contacts, locations - grace testing
// import ContactsScreen from './screens/ContactScreens/ContactPage_G';
// import ShareLocationScreen from './screens/LocationScreens/ShareLocationScreen';

// import MapScreen from './src/MapScreen'; 

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <StatusProvider>
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
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Contacts" component={ContactPage}options={{ headerShown: false }} />
        <Stack.Screen name="SingleContact" component={SingleContactPage} options={{ headerShown: false }}/>
        <Stack.Screen name="Resources" component={ResourcesScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }}/>

        {/* <Stack.Screen name="Map" component={MapScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
    </StatusProvider>
    
  );
}