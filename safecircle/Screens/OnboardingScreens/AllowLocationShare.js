import React from 'react';
import { StyleSheet, Text, View, Pressable, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function AllowLocationShare() {
  const navigation = useNavigation();

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location permission denied');
      navigation.navigate('AllowContactAccess');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log('Location permission granted');
    console.log(location);
    Alert.alert('Location permission granted');
    navigation.navigate('AllowContactAccess');
  };

  const handleSkip = () => {
    navigation.navigate('AllowContactAccess');
  };

  return (
    <ImageBackground
      source={require('../../public/assets/AllowLocation.png')} // replace with your image path
      style={styles.background}
    >
      <View style={styles.buttonContainer}>
        <Pressable onPress={requestLocationPermission} style={styles.button}>
          <Text style={styles.buttonText}>Turn on Location Sharing</Text>
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
