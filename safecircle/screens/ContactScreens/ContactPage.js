import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions, ImageBackground } from 'react-native';
import Fuse from 'fuse.js';
import TabBar from '../TabBar';
import Header from '../Header';

const { width, height } = Dimensions.get('window');

const ContactPage = () => {
  const contacts = [
    { id: '1', name: 'Anna', phone: '(123) 456 7891' },
    { id: '2', name: 'Grace', phone: '(123) 456 7891' },
    { id: '3', name: 'Hannah', phone: '(123) 456 7891' },
    { id: '4', name: 'Jamie', phone: '(123) 456 7891' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  const fuse = new Fuse(contacts, {
    keys: ['name', 'phone'],
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

  const renderItem = ({ item }) => (
    <View style={styles.contactItem}>
      <View style={styles.contactInfo}>
        <Image style={styles.contactImage} source={require('../../public/assets/ProfileIcon.png')} />
        <View>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phone}</Text>
        </View>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity style={styles.actionButtonShare}>
          <Image style={styles.actionIcon} source={require('../../public/assets/ShareIcon.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButtonDelete}>
          <Image style={styles.actionIcon} source={require('../../public/assets/DeleteIcon.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../public/assets/plain-background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <Header title="Emergency Contacts" />

      <View style={styles.container}>
        <Text style={styles.pinnedTitle}>Pinned:</Text>
        <View style={styles.pinnedContacts}>
          {contacts.slice(0, 4).map(contact => (
            <View key={contact.id} style={styles.pinnedContact}>
              <Image style={styles.pinnedImage} source={require('../../public/assets/ProfileIcon.png')} />
              <Text style={styles.pinnedName}>{contact.name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchTerm}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredContacts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.contactList}
        />
        <TabBar />
      </View>
    </ImageBackground>
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
    padding: 15,
    paddingBottom: 100,
  },
  pinnedTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
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
    borderRadius: 10,
    padding: 5,
    width: '100%',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E6E6E6',
    marginRight: 10,
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