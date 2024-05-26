import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Contacts from 'expo-contacts';
import { addContact } from '../../Backend/firebase/addContact';
import { auth } from '../../Backend/firebase/firebaseConfig';

export default function AllowContactAccess() {
  const navigation = useNavigation();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const requestContactsPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Emails, Contacts.Fields.Name],
      });

      if (data.length > 0) {
        console.log('Contacts permission granted');
        Alert.alert('Contacts permission granted');

        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const userEmail = user.email;

          console.log('User UID and email :', [userId, userEmail]);
          console.log('Contacts array:', data);
          //start
          const formattedContacts = data.map(contact => ({
            name: contact.name,
            contactID: contact.id,
            firebase_UID: userId,
            user: userEmail,
          }));

          try {
            await addContact(formattedContacts);
            navigation.navigate('Contacts'); // Navigate to ContactPage on success
          } catch (error) {
            console.error('Error adding contacts: ', error);
            //Alert.alert('Error adding contacts: ', error.message);
          }
        } else {
          console.error('No user is signed in.');
        }
        //end
      } else {
        console.log('No contacts found');
        Alert.alert('No contacts found');
      }
    } else {
      console.log('Contacts permission denied');
      Alert.alert('Contacts permission denied');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Contacts'); // Ensure you navigate to the ContactPage
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../public/assets/AllowContact.png')}
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
            <Pressable onPress={requestContactsPermission} style={styles.button}>
              <Text style={styles.buttonText}>Turn on Contacts Sharing</Text>
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
