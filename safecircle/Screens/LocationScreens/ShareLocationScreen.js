import React, { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { getContacts } from '../../Backend/services/contactsService';
import { requestLocationPermission, getCurrentLocation } from '../../Backend/services/locationService';
import { shareLocation } from '../../Backend/services/shareLocationService';

const ShareLocationScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contacts = await getContacts();
        setContacts(contacts);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchContacts();
  }, []);

  const handleShareLocation = async () => {
    try {
      await requestLocationPermission();
      const location = await getCurrentLocation();
      setLocation(location);
      shareLocation(location, contacts);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Button title="Share Location" onPress={handleShareLocation} />
    </View>
  );
};

export default ShareLocationScreen;
