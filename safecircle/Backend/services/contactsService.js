import Contacts from 'react-native-contacts';

export const getContacts = async () => {
  const permission = await Contacts.requestPermission();
  if (permission === 'authorized') {
    const contacts = await Contacts.getAll();
    return contacts;
  }
  throw new Error('(Backend) Contacts permission denied');
};
