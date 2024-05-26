import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ContactProvider } from './ContactContext'; // Adjust the path as needed
import ContactPage from './ContactPage'; // Adjust the path as needed
import SingleContactPage from './SingleContactPage'; // Adjust the path as needed

const Stack = createStackNavigator();

const App = () => {
  return (
    <ContactProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="ContactPage" component={ContactPage} />
          <Stack.Screen name="SingleContactPage" component={SingleContactPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContactProvider>
  );
};

export default App;
