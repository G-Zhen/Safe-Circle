import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../Backend/firebase/firebaseConfig';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    const loadProfileInfo = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const savedProfile = await AsyncStorage.getItem(user.uid);
          if (savedProfile) {
            setProfileInfo(JSON.parse(savedProfile));
          } else {
            setProfileInfo({
              name: '',
              phone: user.phoneNumber || '',
              email: user.email,
              address: '',
            });
          }
        } else {
          Alert.alert('User not found');
        }
      } catch (error) {
        console.error('Failed to load profile info:', error);
      }
    };

    loadProfileInfo();
  }, []);

  const handleEditPress = async () => {
    if (isEditable) {
      try {
        const user = await getCurrentUser();
        await AsyncStorage.setItem(user.uid, JSON.stringify(profileInfo));
        Alert.alert('Profile saved');
      } catch (error) {
        console.error('Failed to save profile info:', error);
        Alert.alert('Failed to save profile');
      }
    }
    setIsEditable(!isEditable);
  };

  const handleChange = (key, value) => {
    setProfileInfo({
      ...profileInfo,
      [key]: value,
    });
  };

  return (
    <ImageBackground
      source={require('../public/assets/DefaultBackground.png')} // Adjust the path as needed
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.statusWrapper}>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Your Status: Safe</Text>
            </View>
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={profileInfo.name}
          editable={isEditable}
          onChangeText={(text) => handleChange('name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          value={profileInfo.phone}
          editable={isEditable}
          onChangeText={(text) => handleChange('phone', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={profileInfo.email}
          editable={false} // Email is fetched from login information
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={profileInfo.address}
          editable={isEditable}
          onChangeText={(text) => handleChange('address', text)}
        />
        <TouchableOpacity
          style={[styles.editButton, isEditable ? styles.saveButton : styles.editButton]}
          onPress={handleEditPress}
        >
          <Text style={styles.editButtonText}>{isEditable ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    width: '100%',
    marginBottom: 20,
  },
  statusWrapper: {
    width: '100%',
    alignItems: 'flex-end',
  },
  statusContainer: {
    backgroundColor: '#B9E0D3',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 16,
    color: 'black',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 18,
    width: '90%',
    height: 39,
  },
  editButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'flex-end',
    width: '40%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
