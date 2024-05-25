import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Animated, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AllowNotifications() {
  const navigation = useNavigation();

  const requestNotificationPermission = async () => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      try {
        const permission = await Notification.requestPermission();
        console.log(`Notification permission status: ${permission}`);
        if (permission === "granted") {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification("Notifications enabled!");
            navigation.navigate('AllowLocationShare');
          }).catch(error => {
            console.error("Service worker not ready", error);
            navigation.navigate('AllowLocationShare');
          });
        } else {
          console.log("Notifications permission denied");
          navigation.navigate('AllowLocationShare');
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        navigation.navigate('AllowLocationShare');
      }
    } else {
      console.log("Notifications API not supported in this browser.");
      navigation.navigate('AllowLocationShare');
    }
  };

  const handleSkip = () => {
    navigation.navigate('AllowLocationShare');
  };

  return (
      <ImageBackground
        source={require('../../public/assets/NotificationsAllow.png')} // replace with your image path
        style={styles.background}
      >
        <View style={styles.buttonContainer}>
          <Pressable onPress={requestNotificationPermission} style={styles.button}>
            <Text style={styles.buttonText}>Turn on Notifications</Text>
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
