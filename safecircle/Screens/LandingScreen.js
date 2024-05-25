import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LandingScreen = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  useEffect(() => {
    // Start the fade-out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 8000, // 2 seconds
      useNativeDriver: true,
    }).start(() => {
      // Navigate to Onboarding page after the animation completes
      navigation.navigate('Instructions');
    });
  }, [fadeAnim, navigation]);

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <ImageBackground source={require('../public/assets/LandingScreen.png')} style={styles.landingPage}>

      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  landingPage: {
    height: '100%',
    width: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '24px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '10px',
    borderRadius: '5px',
  },
  text: {
    color: '#fff',
    fontSize: '24px',
  },
});

export default LandingScreen;
