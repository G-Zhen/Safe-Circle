import React, { useEffect } from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LandingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Delay the navigation to the Instructions page by 2 seconds
    const timeout = setTimeout(() => {
      navigation.navigate('Instructions');
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timeout); // Clear the timeout if the component unmounts
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../public/assets/LandingScreen.png')} style={styles.landingPage}>
        {/* Any additional content for the LandingScreen */}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  landingPage: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
});

export default LandingScreen;