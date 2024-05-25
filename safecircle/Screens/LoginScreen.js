import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../Backend/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import signInWithGoogle from '../Backend/firebase/GoogleSignIn';
import { signUpWithEmail, loginWithEmail } from '../Backend/firebase/EmailPasswordSignIn';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        navigation.navigate('Home');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEmailLogin = async () => {
    setLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      console.error('Email login error: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      navigation.navigate('Onboarding');
    } catch (error) {
      console.error('Email sign-up error: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle((route) => {
        navigation.navigate(route);
      });
    } catch (error) {
      console.error('Google sign-in error: ', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Login with</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable onPress={handleEmailLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login with Email</Text>
      </Pressable>
      <Pressable onPress={handleEmailSignUp} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up with Email</Text>
      </Pressable>

      <Text>or</Text>

      <Pressable onPress={handleGoogleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Google</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
