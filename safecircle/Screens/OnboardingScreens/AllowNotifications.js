import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ImageBackground, Alert, ActivityIndicator, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export default function AllowNotifications() {
  const navigation = useNavigation();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const registerForPushNotificationsAsync = async () => {
    setLoading(true);
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        setLoading(false);
        navigation.navigate('AllowLocationShare');
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token:', token);

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      Alert.alert('Notification permissions granted');
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }

    setLoading(false);
    navigation.navigate('AllowLocationShare');
    return token;
  };

  const handleSkip = () => {
    navigation.navigate('AllowLocationShare');
  };

  const handlePress = async () => {
    if (__DEV__) {
      Alert.alert('Development Mode', 'Push notifications are not available in development mode.');
      navigation.navigate('AllowLocationShare');
    } else {
      await registerForPushNotificationsAsync();
    }
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
            <Pressable onPress={handlePress} style={styles.button}>
              <Text style={styles.buttonText}>Turn on Notifications</Text>
            </Pressable>
            <Pressable onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </Pressable>
          </View>
        )}
      </ImageBackground>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
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
    borderWidth: 3,
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
    borderWidth: 3,
  },
  skipButtonText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'semibold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
