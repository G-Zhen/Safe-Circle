import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CreateAccount() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CreateAccount</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Your informational content goes here...</Text>
      </View>
      <Pressable onPress={() => navigation.navigate('Login')} style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Adjust as needed
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoBox: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ccc', // Adjust as needed
    borderRadius: 10,
    marginVertical: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});