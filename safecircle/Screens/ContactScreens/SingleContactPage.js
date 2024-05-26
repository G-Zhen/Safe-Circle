import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import TabBar from '../TabBar';

const { width, height } = Dimensions.get('window');

const SingleContactPage = () => {
  const route = useRoute();
  const { contact, isPinned, handlePin } = route.params;
  const [contactInfo, setContactInfo] = useState({
    name: contact.name,
    phone: contact.phoneNumbers ? contact.phoneNumbers.join(', ') : 'N/A',
  });
  const [pinned, setPinned] = useState(isPinned);

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const savedContact = await AsyncStorage.getItem(contact.contactID);
        if (savedContact) {
          setContactInfo(JSON.parse(savedContact));
        }
      } catch (error) {
        console.error('Failed to load contact info:', error);
      }
    };

    loadContactInfo();
  }, [contact.contactID]);

  const shareLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const locationMessage = `Location is being shared through SafeCircle: https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync(contact.phoneNumbers, locationMessage);
      } else {
        Alert.alert('SMS is not available on this device');
      }
    } catch (error) {
      console.error('Error sharing location:', error);
      Alert.alert('Error', 'An error occurred while trying to share the location');
    }
  };

  const togglePin = () => {
    handlePin(contact);
    setPinned(!pinned);
  };

  return (
    <ImageBackground
      source={require('../../public/assets/DefaultBackground.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image style={styles.profileImage} source={require('../../public/assets/ProfileIcon.png')} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{contact.name}</Text>
            <Text style={styles.contactInfo}>{contact.phoneNumbers ? contact.phoneNumbers.join(', ') : 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={togglePin}>
            <Text style={styles.actionButtonText}>{pinned ? 'Unpin Profile' : 'Pin Profile'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={shareLocation}>
            <Text style={styles.actionButtonText}>Share Location</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TabBar />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: width * 0.9,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0E68C',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  profileInfo: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfo: {
    fontSize: 14,
    color: 'black',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#E9E4F9',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    width: '45%',
  },
  actionButtonText: {
    fontSize: 16,
  },
});

export default SingleContactPage;
