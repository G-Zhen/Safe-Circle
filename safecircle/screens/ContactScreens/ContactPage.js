import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');

const ContactPage = () => {
  const contacts = [
    { id: '1', name: 'Anna', phone: '(123) 456 7891' },
    { id: '2', name: 'Grace', phone: '(123) 456 7891' },
    { id: '3', name: 'Hannah', phone: '(123) 456 7891' },
    { id: '4', name: 'Jamie', phone: '(123) 456 7891' },
  ];

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
        <TouchableOpacity style={styles.actionButton}>
          <Image style={styles.actionIcon} source={require('../../public/assets/ShareIcon.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Image style={styles.actionIcon} source={require('../../public/assets/DeleteIcon.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>SAFE CIRCLE</Text>
        </View>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Farahnaz's Status: Safe</Text>
        </View>
        <Text style={styles.pinnedTitle}>Pinned:</Text>
        <View style={styles.pinnedContacts}>
          {/* Add pinned contacts here */}
          {contacts.slice(0, 4).map(contact => (
            <View key={contact.id} style={styles.pinnedContact}>
              <Image style={styles.pinnedImage} source={require('../../public/assets/ProfileIcon.png')} />
              <Text style={styles.pinnedName}>{contact.name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Search" />
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.contactList}
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text>Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text>Resources</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B47A3',
  },
  header: {
    padding: 20,
    backgroundColor: '#4B47A3',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusContainer: {
    backgroundColor: '#B9E0D3',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#000000',
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
    backgroundColor: '#6B67D3',
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
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 5,
    marginLeft: 5,
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#D3D3D3',
    paddingVertical: 10,
  },
  footerButton: {
    alignItems: 'center',
  },
});

export default ContactPage;
