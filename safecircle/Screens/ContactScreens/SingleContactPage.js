import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const SingleContactPage = () => {
  const route = useRoute();
  const { contact } = route.params;
  const [isEditable, setIsEditable] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: contact.name,
    phone: contact.phoneNumbers ? contact.phoneNumbers.map(p => p.number).join(', ') : 'N/A',
    email: '',
    address: '',
  });

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const savedContact = await AsyncStorage.getItem(contact.id);
        if (savedContact) {
          setContactInfo(JSON.parse(savedContact));
        }
      } catch (error) {
        console.error('Failed to load contact info:', error);
      }
    };

    loadContactInfo();
  }, [contact.id]);

  const handleEditPress = async () => {
    if (isEditable) {
      try {
        await AsyncStorage.setItem(contact.id, JSON.stringify(contactInfo));
        Alert.alert('Contact saved');
      } catch (error) {
        console.error('Failed to save contact info:', error);
        Alert.alert('Failed to save contact');
      }
    }
    setIsEditable(!isEditable);
  };

  const handleChange = (key, value) => {
    setContactInfo({
      ...contactInfo,
      [key]: value,
    });
  };

  return (
    <ImageBackground
      source={require('../../public/assets/DefaultBackground.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.statusWrapper}>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Farahnaz's Status: Safe</Text>
            </View>
          </View>
        </View>
        <View style={styles.profileContainer}>
          <Image style={styles.profileImage} source={require('../../public/assets/ProfileIcon.png')} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{contact.name}</Text>
            <Text style={styles.contactInfo}>{contact.phoneNumbers ? contact.phoneNumbers.map(p => p.number).join(', ') : 'N/A'}</Text>
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={contactInfo.name}
          editable={isEditable}
          onChangeText={(text) => handleChange('name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          value={contactInfo.phone}
          editable={isEditable}
          onChangeText={(text) => handleChange('phone', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={contactInfo.email}
          editable={isEditable}
          onChangeText={(text) => handleChange('email', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={contactInfo.address}
          editable={isEditable}
          onChangeText={(text) => handleChange('address', text)}
        />
        <TouchableOpacity
          style={[styles.editButton, isEditable ? styles.saveButton : styles.editButton]}
          onPress={handleEditPress}
        >
          <Text style={styles.editButtonText}>{isEditable ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Pin Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Share Location</Text>
          </TouchableOpacity>
        </View>
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
    width: width * 0.9, // Adjust width as needed
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
    paddingVertical: 10, // Increased padding
    paddingHorizontal: 20, // Increased padding
  },
  statusText: {
    fontSize: 16,
    color: 'black',
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
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 18,
    width: '90%',
    height: 39, // Full width for input fields
  },
  editButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'flex-end',
    width: '40%', // Full width for the button
  },
  saveButton: {
    backgroundColor: '#4CAF50', // Green color for save button
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '100%', // Full width for the container
  },
  actionButton: {
    backgroundColor: '#E9E4F9',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    width: '45%', // Adjust width for action buttons
  },
  actionButtonText: {
    fontSize: 16,
  },
});

export default SingleContactPage;