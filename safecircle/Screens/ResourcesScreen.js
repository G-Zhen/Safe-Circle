import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { logout } from '../Backend/firebase/EmailPasswordSignIn';
import { useNavigation } from '@react-navigation/native';
import TabBar from './TabBar';

export default function ResourcesScreen() {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Resources!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
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
