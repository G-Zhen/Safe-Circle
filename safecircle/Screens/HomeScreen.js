import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { logout } from '../Backend/firebase/EmailPasswordSignIn';
import { useNavigation } from '@react-navigation/native';
import TabBar from './TabBar';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await logout();
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Hello, you're in!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />

      <Button title="Go to Contacts" onPress={() => navigation.navigate('ContactsScreen')} />
      <Button title="Go to Share Location" onPress={() => navigation.navigate('ShareLocationScreen')} />
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
