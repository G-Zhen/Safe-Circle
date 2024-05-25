import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Animated, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AllowContactAccess() {
  const navigation = useNavigation();

  const requestContactsPermission = async () => {
    if ("contacts" in navigator && "ContactsManager" in window) {
      try {
        const contacts = await navigator.contacts.select(['name', 'email'], { multiple: true });
        console.log('Contacts permission granted');
        console.log(contacts);
        Alert.alert('Contacts permission granted');
      } catch (error) {
        console.log('Contacts permission denied', error);
        Alert.alert('Contacts permission denied');
      }
    } else {
      console.log('Contacts API not supported in this browser.');
      Alert.alert('Contacts API not supported in this browser.');
    }
    navigation.navigate('LoginScreen');
  };

  const handleSkip = () => {
    navigation.navigate('LoginScreen');
  };

  return (
      <ImageBackground
        source={require('../../public/assets/AllowContact.png')} // replace with your image path
        style={styles.background}
      >
        <View style={styles.buttonContainer}>
          <Pressable onPress={requestContactsPermission} style={styles.button}>
            <Text style={styles.buttonText}>Turn on Contacts Sharing</Text>
          </Pressable>
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </Pressable>
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 180, // Adjust this value to control the distance from the bottom
  },
  button: {
    backgroundColor: '#F6F7B0',
    padding: 10,
    borderRadius: 20,
    width: 370,
    marginBottom: 10, // Add some space between the buttons
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'semibold',
  },
  skipButton: {
    marginTop: 10, // Add some space between the buttons
    backgroundColor: '#E7E1FA', // Different background color for skip button
    padding: 10,
    borderRadius: 20,
    width: 370,
  },
  skipButtonText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'semibold',
  },
});
