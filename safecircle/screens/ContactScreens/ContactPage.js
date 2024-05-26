import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions, ImageBackground, Share, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Fuse from 'fuse.js';
import TabBar from '../TabBar';
import Header from '../Header';
import { getContacts } from '../../Backend/firebase/addContact';
import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const ContactPage = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [pinnedContacts, setPinnedContacts] = useState([]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    fetchContacts();
    fetchPinnedContacts();
  }, []);

  const fetchContacts = async () => {
    const userContacts = await getContacts();
    setContacts(userContacts);
    setFilteredContacts(userContacts);
  };

  const fetchPinnedContacts = async () => {
    const pinned = await AsyncStorage.getItem('pinnedContacts');
    if (pinned) {
      setPinnedContacts(JSON.parse(pinned));
    }
  };

  const handlePin = async (contact) => {
    const isPinned = pinnedContacts.some(c => c.contactID === contact.contactID);
    let updatedPinnedContacts;

    if (isPinned) {
      updatedPinnedContacts = pinnedContacts.filter(c => c.contactID !== contact.contactID);
    } else {
      updatedPinnedContacts = [...pinnedContacts, contact];
    }

    setPinnedContacts(updatedPinnedContacts);
    await AsyncStorage.setItem('pinnedContacts', JSON.stringify(updatedPinnedContacts));
  };

  const fuse = new Fuse(contacts, {
    keys: ['name', 'phoneNumbers'],
    includeScore: true,
  });

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text === '') {
      setFilteredContacts(contacts);
    } else {
      const results = fuse.search(text);
      const matchedContacts = results.map(result => result.item);
      setFilteredContacts(matchedContacts);
    }
  };

  const handleShare = async (contact) => {
    try {
      const phoneNumbers = contact.phoneNumbers;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const message = `Location is being shared through SafeCircle: https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`;

      if (await SMS.isAvailableAsync()) {
        await SMS.sendSMSAsync(
          phoneNumbers,
          message
        );
      } else {
        Alert.alert('SMS is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to share the location');
      console.error(error);
    }
  };

  const handleDelete = (contactId) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedContacts = contacts.filter(contact => contact.contactID !== contactId);
            setContacts(updatedContacts);
            setFilteredContacts(updatedContacts);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('SingleContactPage', { contact: item, isPinned: pinnedContacts.some(c => c.contactID === item.contactID), handlePin })}>
      <View style={styles.contactItem}>
        <View style={styles.contactInfo}>
          <Image style={styles.contactImage} source={require('../../public/assets/ProfileIcon.png')} />
          <View>
            <Text style={styles.contactName}>{item.name}</Text>
            {item.phoneNumbers.map((phone, index) => (
              <Text key={index} style={styles.contactPhone}>{phone}</Text>
            ))}
          </View>
        </View>
        <View style={styles.contactActions}>
          <TouchableOpacity style={styles.actionButtonShare} onPress={() => handleShare(item)}>
            <Image style={styles.actionIcon} source={require('../../public/assets/ShareIcon.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonDelete} onPress={() => handleDelete(item.contactID)}>
            <Image style={styles.actionIcon} source={require('../../public/assets/DeleteIcon.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../public/assets/plain-background.png')}
        style={styles.background}
        resizeMode="cover"
        onLoad={() => setIsImageLoaded(true)}
      >
        {!isImageLoaded && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        {isImageLoaded && (
          <View style={styles.innerContainer}>
            <Header title="Emergency Contacts" />
            <Text style={styles.pinnedTitle}>Pinned:</Text>
            <View style={styles.pinnedContacts}>
              {pinnedContacts.map(contact => (
                <TouchableOpacity key={contact.contactID} onPress={() => navigation.navigate('SingleContactPage', { contact, isPinned: true, handlePin })}>
                  <View style={styles.pinnedContact}>
                    <Image style={styles.pinnedImage} source={require('../../public/assets/ProfileIcon.png')} />
                    <Text style={styles.pinnedName}>{contact.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.searchContainer}>
              <Image source={require('../../public/assets/search-icon.png')} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#999999"
                value={searchTerm}
                onChangeText={handleSearch}
              />
            </View>
            <FlatList
              data={filteredContacts}
              renderItem={renderItem}
              keyExtractor={item => item.contactID}
              contentContainerStyle={styles.contactList}
            />
            <TabBar />
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 15,
    paddingBottom: 100,
    paddingTop: 20,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  pinnedTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'semibold',
    fontStyle: 'italic',
  },
  pinnedContacts: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  pinnedContact: {
    alignItems: 'center',
  },
  pinnedImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  pinnedName: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    width: '100%',
    marginBottom: 10,
    borderWidth: 4,
  },
  searchIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginLeft:5
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#E6E6E6',
    marginRight: 10,
    borderWidth: 2,
    color: 'black',
  },
  addButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    padding: 10,
  },
  addButtonText: {
    fontSize: 20,
    color: '#4B47A3',
  },
  contactList: {
    paddingHorizontal: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contactName: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  contactActions: {
    flexDirection: 'row',
  },
  actionButtonShare: {
    backgroundColor: '#B7BBDB',
    borderRadius: 20,
    padding: 5,
    marginLeft: 5,
    borderWidth: 2,
    borderColor: '#17156',
  },
  actionButtonDelete: {
    backgroundColor: '#F2B7B7',
    borderRadius: 20,
    padding: 5,
    marginLeft: 5,
    borderWidth: 2,
    borderColor: '#17156',
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
});

export default ContactPage;
