import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function AllowLocationShare() {
  const navigation = useNavigation();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  const requestLocationPermission = async () => {
    setIsRequestingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location permission denied');
        navigation.navigate('AllowContactAccess');
        setIsRequestingLocation(false);
        return;
      }

      let location = await Location.getLastKnownPositionAsync({});
      if (!location) {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 20000, // Set a timeout of 20 seconds
        });
      }

      console.log('Location permission granted');
      console.log(location);
      Alert.alert('Location permission granted');
      navigation.navigate('AllowContactAccess');
    } catch (error) {
      Alert.alert('Failed to fetch location', 'Please try again.');
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleSkip = () => {
    navigation.navigate('AllowContactAccess');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../public/assets/AllowLocation.png')}
        style={styles.background}
        onLoad={() => setIsImageLoaded(true)}
      >
        {!isImageLoaded && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        {isImageLoaded && (
          <View style={styles.buttonContainer}>
            {isRequestingLocation ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                <Pressable onPress={requestLocationPermission} style={styles.button}>
                  <Text style={styles.buttonText}>Turn on Location Sharing</Text>
                </Pressable>
                <Pressable onPress={handleSkip} style={styles.skipButton}>
                  <Text style={styles.skipButtonText}>Skip</Text>
                </Pressable>
              </>
            )}
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 160,
  },
  button: {
    backgroundColor: '#F6F7B0',
    padding: 10,
    borderRadius: 20,
    width: 370,
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'semibold',
  },
  skipButton: {
    marginTop: 10,
    backgroundColor: '#E7E1FA',
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
