import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Contacts from 'react-native-contacts';
import { getContacts as getMockContacts } from '../../Backend/services/mocks/mockContacts';

const ContactsComponent = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Use mock service in web environment
      getMockContacts().then(mockContacts => {
        setContacts(mockContacts);
      });
    } else {
      // Use real contacts service in native environments
      Contacts.requestPermission().then(permission => {
        if (permission === 'authorized') {
          Contacts.getAll().then(contacts => {
            setContacts(contacts);
          });
        }
      });
    }
  }, []);

  return (
    <div>
      {contacts.map(contact => (
        <div key={contact.id}>
          {contact.givenName} {contact.familyName} - {contact.phoneNumbers[0].number}
        </div>
      ))}
    </div>
  );
};

export default ContactsComponent;
