import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../Backend/firebase/firebaseConfig';
import Header from './Header';
import TabBar from './TabBar';

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
          <Header title="My Profile" />
        
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="grey"
          value={profileInfo.name}
          editable={isEditable}
          onChangeText={(text) => handleChange('name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          placeholderTextColor="grey"
          value={profileInfo.phone}
          editable={isEditable}
          onChangeText={(text) => handleChange('phone', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="black"
          value={profileInfo.email}
          editable={false} // Email is fetched from login information
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="grey"
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
    paddingTop: 150,
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#F6F7B0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '90%',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginVertical: 15,
    width: '90%',
    height: 42,
    color: 'black', // Change text color to black
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: '#F6F7B0',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'flex-end',
    width: '40%', 
    borderWidth: 3,
  },
  saveButton: {
    backgroundColor: '#92BDA6',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;