import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Animated, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AllowLocationShare() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0.05)).current; // Initial value for opacity: 0

  useEffect(() => {
    // Start the fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // 0.5 seconds
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const requestLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location permission granted');
          console.log(position);
          Alert.alert('Location permission granted');
          navigation.navigate('AllowContactAccess');
        },
        (error) => {
          console.log('Location permission denied', error);
          Alert.alert('Location permission denied');
          navigation.navigate('AllowContactAccess');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    } else {
      console.log('Geolocation API not supported in this browser.');
      Alert.alert('Geolocation API not supported in this browser.');
      navigation.navigate('AllowContactAccess');
    }
  };

  const handleSkip = () => {
    navigation.navigate('AllowContactAccess');
  };

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
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
    </Animated.View>
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
