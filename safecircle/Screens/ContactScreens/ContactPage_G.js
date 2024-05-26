import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';
import { getContacts as getMockContacts } from '../../Backend/services/mocks/mockContacts';

const ContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (Platform.OS === 'web') {
          // Use mock service in web environment
          const mockContacts = await getMockContacts();
          setContacts(mockContacts);
        } else {
          // Request permission and fetch contacts on native platforms
          const permission = await requestContactsPermission();
          if (permission === 'authorized') {
            const nativeContacts = await Contacts.getAll();
            setContacts(nativeContacts);
          }
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchContacts();
  }, []);

  const requestContactsPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Please accept bare mortal',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED ? 'authorized' : 'denied';
    } else if (Platform.OS === 'ios') {
      const permission = await Contacts.requestPermission();
      return permission;
    }
    return 'authorized';
  };

  const renderItem = ({ item }) => (
    <View style={styles.contactItem}>
      <Text style={styles.contactName}>{item.givenName} {item.familyName}</Text>
      {item.phoneNumbers.map(phone => (
        <Text key={phone.id} style={styles.contactPhone}>{phone.label}: {phone.number}</Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No contacts found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  contactItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ContactsScreen;
