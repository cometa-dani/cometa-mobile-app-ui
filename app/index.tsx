import { ImageBackground, StyleSheet, View, Text } from 'react-native';
import { router } from 'expo-router';
import { LightButton } from '../components/buttons/LightButton';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';


export default function StartScreen(): JSX.Element {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // router.push('/(app)/');
      }
      else {
        // router.push('/(onboarding)/register');
      }
    });
  }, []);

  return (
    <ImageBackground style={styles.imageBackground} source={require('../assets/images/welcome-image.jpeg')}>
      <View style={styles.textContainer}>
        <Text style={styles.h1}>Discover New Experiences</Text>
      </View>

      <LightButton onPress={() => router.push('/(app)/')} text='get started' />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  h1: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
  },

  imageBackground: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 30
  },

  textContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%'
  },
});
