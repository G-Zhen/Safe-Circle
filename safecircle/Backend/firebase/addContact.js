// goood works but slow needs pagination
import { firestore, auth } from '../firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export const addContact = async (contacts) => {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const userEmail = user.email;
    try {
      await addDoc(collection(firestore, 'contacts'), {
        firebase_UID: userId,
        user: userEmail,
        allContacts: contacts,
      });
      console.log('Contacts added!');
      Alert.alert('Contacts added!');
    } catch (error) {
      console.error('Error adding contacts: ', error);
      //Alert.alert('Error adding contacts: ', error.message);
    }
  } else {
    console.error('No user is signed in.');
  }
};

export const getContacts = async () => {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    try {
      const q = query(collection(firestore, 'contacts'), where('firebase_UID', '==', userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return userDoc.data().allContacts;
      } else {
        console.log('No contacts found for this user.');
        Alert.alert('No contacts found for this user.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching contacts: ', error);
      Alert.alert('Error fetching contacts: ', error.message);
      return [];
    }
  } else {
    console.error('No user is signed in.');
    return [];
  }
};
