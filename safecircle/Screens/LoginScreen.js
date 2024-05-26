import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator, Image, ImageBackground, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../Backend/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import signInWithGoogle from '../Backend/firebase/GoogleSignIn';
import { signUpWithEmail, loginWithEmail } from '../Backend/firebase/EmailPasswordSignIn';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

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
        navigation.navigate('AllowNotifications');
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
      navigation.navigate('AllowNotifications');
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
    <ImageBackground source={require('../public/assets/DefaultBackground.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Sign In</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#000"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#000"
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

          <Text style={styles.orText}>or</Text>

          <Pressable onPress={handleGoogleSignIn} style={styles.googleButton}>
            <Image source={require('../public/assets/Google icons 64.png')} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Sign Up with Google</Text>
          </Pressable>
        </View>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',  // Ensure the image covers the full width
    height: '100%', // Ensure the image covers the full height
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  card: {
    width: 345,
    height: 480,
    backgroundColor: '#A3A8CE', // pastel purple color
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 3,

  },
  title: {
    fontSize: 30,
    color: '#17156F',
    marginBottom: 30,
    fontWeight: 'bold', // Bold text
    fontStyle: 'italic', // Italicized text
  },
  input: {
    width: 288,
    height: 39,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#F6F7B0',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: 288,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center', // Ensure the text is centered
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600', // Use '600' instead of 'semibold' for bold text
  },
  googleButton: {
    flexDirection: 'row', // Arrange children in a row
    backgroundColor: '#F6F7B0',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: 288,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 16,
    height: 16,
    marginRight: 10, // Space between the icon and text
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600', // Use '600' instead of 'semibold' for bold text
  },
  orText: {
    color: '#17156F',
    marginVertical: 10,
    fontSize: 20,
  },
});