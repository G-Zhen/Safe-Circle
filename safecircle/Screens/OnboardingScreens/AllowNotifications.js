import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ImageBackground, Alert, ActivityIndicator, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

export default function AllowNotifications() {
  const navigation = useNavigation();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const requestNotificationPermission = async () => {
    try {
      // Check existing notification permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not already granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // If permissions are not granted, show an alert and navigate to the next screen
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        navigation.navigate('AllowLocationShare');
        return;
      }

      // Get the Expo push token (with a deprecation warning if projectId is not specified)
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token:', token);

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Show success alert and navigate to the next screen
      Alert.alert('Notification permissions granted');
      navigation.navigate('AllowLocationShare');
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      Alert.alert('An error occurred while requesting notification permissions.');
    }
  };

  const handleSkip = () => {
    navigation.navigate('AllowLocationShare');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../public/assets/NotificationsAllow.png')} // replace with your image path
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
            <Pressable onPress={requestNotificationPermission} style={styles.button}>
              <Text style={styles.buttonText}>Turn on Notifications</Text>
            </Pressable>
            <Pressable onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </Pressable>
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
    marginBottom: 160, // Adjust this value to control the distance from the bottom
  },
  button: {
    backgroundColor: '#F6F7B0',
    padding: 10,
    borderRadius: 20,
    width: 370,
    marginBottom: 10, // Add some space between the buttons
    borderWidth: 3,

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
    borderWidth: 3,

  },
  skipButtonText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'semibold',
    
  },
});