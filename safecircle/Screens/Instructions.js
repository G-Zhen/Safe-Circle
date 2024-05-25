import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Animated, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Instructions() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0.05)).current; // Initial value for opacity: 0

  useEffect(() => {
    // Start the fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500, // 2 seconds
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <ImageBackground
        source={require('../public/assets/Instructions.png')} // replace with your image path
        style={styles.background}
      >
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => navigation.navigate('KeyFeatures')} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 180, // Adjust this value to control the distance from the bottom
  },
  button: {
    backgroundColor: '#F6F7B0',
    padding: 10,
    borderRadius: 20,
    width: 370,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight:'semibold'
  },
});
