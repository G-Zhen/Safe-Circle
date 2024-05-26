import React, { useEffect, useState } from 'react';
import AppNavigator from './AppNavigator';
import { getCurrentUser } from './Backend/firebase/firebaseConfig';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(console.error);
  }, []);

  return <AppNavigator />;
}