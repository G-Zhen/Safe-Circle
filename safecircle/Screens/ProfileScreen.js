import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { logout } from '../Backend/firebase/EmailPasswordSignIn';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
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
      <Text>Profile!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
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
